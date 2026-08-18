const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const fields = {
  clientName: document.querySelector("#clientName"),
  validUntil: document.querySelector("#validUntil"),
  itemName: document.querySelector("#itemName"),
  itemQty: document.querySelector("#itemQty"),
  itemPrice: document.querySelector("#itemPrice"),
  discount: document.querySelector("#discount"),
  notes: document.querySelector("#notes"),
};

const itemsList = document.querySelector("#itemsList");
const subtotalEl = document.querySelector("#subtotal");
const discountValueEl = document.querySelector("#discountValue");
const totalEl = document.querySelector("#total");
const historyEl = document.querySelector("#history");
const feedback = document.querySelector("#feedback");

let items = [];

function getTotals() {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discountPercent = Number(fields.discount.value || 0);
  const discountValue = subtotal * (discountPercent / 100);
  const total = subtotal - discountValue;

  return { subtotal, discountValue, total };
}

function renderItems() {
  itemsList.innerHTML = "";

  if (items.length === 0) {
    itemsList.innerHTML = document.querySelector("#emptyTemplate").innerHTML;
  }

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "quote-item";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>${item.qty} x ${currency.format(item.price)}</span>
      </div>
      <button class="remove" type="button" aria-label="Remover item">Remover</button>
    `;

    row.querySelector("button").addEventListener("click", () => {
      items.splice(index, 1);
      renderItems();
    });

    itemsList.appendChild(row);
  });

  const totals = getTotals();
  subtotalEl.textContent = currency.format(totals.subtotal);
  discountValueEl.textContent = currency.format(totals.discountValue);
  totalEl.textContent = currency.format(totals.total);
}

function buildMessage() {
  const totals = getTotals();
  const lines = items
    .map((item) => `- ${item.name}: ${item.qty} x ${currency.format(item.price)}`)
    .join("\n");

  return `Olá, ${fields.clientName.value}.\n\nSegue orçamento:\n${lines}\n\nSubtotal: ${currency.format(totals.subtotal)}\nDesconto: ${currency.format(totals.discountValue)}\nTotal: ${currency.format(totals.total)}\nValidade: ${fields.validUntil.value}\n\nObservações: ${fields.notes.value || "Sem observações."}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) {
    return "Não informada";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function buildPrintableQuote() {
  const totals = getTotals();
  const rows = items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${item.qty}</td>
          <td>${currency.format(item.price)}</td>
          <td>${currency.format(item.qty * item.price)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Orçamento - ${escapeHtml(fields.clientName.value)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: #f4f1ea;
            color: #1e293b;
            font-family: Arial, Helvetica, sans-serif;
          }
          .page {
            width: min(900px, calc(100% - 32px));
            margin: 24px auto;
            background: #fffdf7;
            border: 1px solid #ddd6c8;
            padding: 36px;
          }
          header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            border-bottom: 2px solid #e9c46a;
            padding-bottom: 22px;
          }
          h1, h2, p { margin: 0; }
          h1 { font-size: 34px; }
          .badge {
            display: inline-block;
            margin-bottom: 10px;
            color: #b7791f;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .meta {
            min-width: 230px;
            color: #64748b;
            line-height: 1.7;
            text-align: right;
          }
          .client {
            display: grid;
            gap: 8px;
            margin: 28px 0;
            border: 1px solid #ddd6c8;
            background: #f8f5ee;
            padding: 18px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
          }
          th, td {
            border-bottom: 1px solid #ddd6c8;
            padding: 12px 10px;
            text-align: left;
          }
          th {
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
          }
          td:nth-child(2),
          td:nth-child(3),
          td:nth-child(4),
          th:nth-child(2),
          th:nth-child(3),
          th:nth-child(4) {
            text-align: right;
          }
          .totals {
            display: grid;
            gap: 10px;
            max-width: 360px;
            margin: 26px 0 0 auto;
          }
          .totals div {
            display: flex;
            justify-content: space-between;
          }
          .total {
            border-top: 2px solid #e9c46a;
            padding-top: 12px;
            color: #243b6b;
            font-size: 22px;
            font-weight: 800;
          }
          .notes {
            margin-top: 30px;
            border: 1px solid #ddd6c8;
            padding: 18px;
            line-height: 1.6;
          }
          footer {
            margin-top: 34px;
            color: #64748b;
            font-size: 13px;
            line-height: 1.6;
          }
          .screen-actions {
            display: flex;
            gap: 10px;
            margin: 0 auto 18px;
            width: min(900px, calc(100% - 32px));
          }
          button {
            border: 0;
            background: #243b6b;
            color: white;
            padding: 10px 14px;
            font-weight: 800;
            cursor: pointer;
          }
          @media print {
            body { background: white; }
            .screen-actions { display: none; }
            .page {
              width: 100%;
              margin: 0;
              border: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="screen-actions">
          <button onclick="window.print()">Salvar como PDF</button>
          <button onclick="window.close()">Fechar</button>
        </div>
        <main class="page">
          <header>
            <div>
              <span class="badge">Orçamento comercial</span>
              <h1>Proposta de orçamento</h1>
            </div>
            <div class="meta">
              <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
              <p>Validade: ${formatDate(fields.validUntil.value)}</p>
            </div>
          </header>

          <section class="client">
            <strong>Cliente</strong>
            <span>${escapeHtml(fields.clientName.value)}</span>
          </section>

          <section>
            <h2>Itens do orçamento</h2>
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Qtd.</th>
                  <th>Valor unitário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </section>

          <section class="totals">
            <div><span>Subtotal</span><strong>${currency.format(totals.subtotal)}</strong></div>
            <div><span>Desconto</span><strong>${currency.format(totals.discountValue)}</strong></div>
            <div class="total"><span>Total</span><strong>${currency.format(totals.total)}</strong></div>
          </section>

          <section class="notes">
            <strong>Observações</strong>
            <p>${escapeHtml(fields.notes.value || "Sem observações.")}</p>
          </section>

          <footer>
            <p>Documento gerado pelo OrçaFácil. Em um projeto real, este espaço pode receber logo, CNPJ, dados de contato, formas de pagamento e assinatura.</p>
          </footer>
        </main>
        <script>
          window.addEventListener("load", () => {
            setTimeout(() => window.print(), 300);
          });
        </script>
      </body>
    </html>
  `;
}

function exportQuotePdf() {
  if (!fields.clientName.value || items.length === 0) {
    feedback.textContent = "Informe o cliente e adicione pelo menos um item.";
    return;
  }

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    feedback.textContent = "Permita pop-ups para exportar o PDF.";
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildPrintableQuote());
  printWindow.document.close();
  feedback.textContent = "Orçamento aberto para salvar como PDF.";
}

function getHistory() {
  return JSON.parse(localStorage.getItem("quotes") || "[]");
}

function saveHistory(history) {
  localStorage.setItem("quotes", JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();
  historyEl.innerHTML = "";

  if (history.length === 0) {
    historyEl.innerHTML = '<p class="empty">Nenhum orçamento salvo.</p>';
    return;
  }

  history.forEach((quote) => {
    const card = document.createElement("article");
    card.className = "history-card";
    card.innerHTML = `
      <strong>${quote.client}</strong>
      <span>Total: ${currency.format(quote.total)}</span>
      <span>Itens: ${quote.itemsCount}</span>
      <span>Data: ${quote.createdAt}</span>
    `;
    historyEl.appendChild(card);
  });
}

document.querySelector("#addItem").addEventListener("click", () => {
  const name = fields.itemName.value.trim();
  const qty = Number(fields.itemQty.value || 1);
  const price = Number(fields.itemPrice.value || 0);

  if (!name || price <= 0) {
    feedback.textContent = "Informe o item e um valor maior que zero.";
    return;
  }

  items.push({ name, qty, price });
  fields.itemName.value = "";
  fields.itemQty.value = "1";
  fields.itemPrice.value = "0";
  feedback.textContent = "";
  renderItems();
});

fields.discount.addEventListener("input", renderItems);

document.querySelector("#copyMessage").addEventListener("click", async () => {
  if (!fields.clientName.value || items.length === 0) {
    feedback.textContent = "Informe o cliente e adicione pelo menos um item.";
    return;
  }

  await navigator.clipboard.writeText(buildMessage());
  feedback.textContent = "Mensagem copiada para a área de transferência.";
});

document.querySelector("#exportPdf").addEventListener("click", exportQuotePdf);

document.querySelector("#saveQuote").addEventListener("click", () => {
  if (!fields.clientName.value || items.length === 0) {
    feedback.textContent = "Informe o cliente e adicione pelo menos um item.";
    return;
  }

  const totals = getTotals();
  const history = getHistory();
  history.unshift({
    client: fields.clientName.value,
    total: totals.total,
    itemsCount: items.length,
    createdAt: new Date().toLocaleDateString("pt-BR"),
  });

  saveHistory(history.slice(0, 9));
  renderHistory();
  feedback.textContent = "Orçamento salvo no histórico.";
});

document.querySelector("#clearHistory").addEventListener("click", () => {
  localStorage.removeItem("quotes");
  renderHistory();
  feedback.textContent = "Histórico limpo.";
});

renderItems();
renderHistory();
