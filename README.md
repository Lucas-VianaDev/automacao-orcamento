# OrçaFácil - Automação de orçamentos

Ferramenta demonstrativa para criar orçamentos de forma rápida.

https://lucas-vianadev.github.io/automacao-orcamento/

## O problema

Muitos pequenos negócios ainda criam orçamentos manualmente no WhatsApp, no caderno ou em planilhas desorganizadas. Isso gera demora, erro de cálculo e perda de oportunidades.

## A solução

O OrçaFácil permite:

- Cadastrar cliente
- Definir validade do orçamento
- Adicionar serviços ou produtos
- Calcular subtotal, desconto e total
- Copiar uma mensagem pronta para WhatsApp
- Exportar uma versão imprimível para salvar como PDF
- Salvar histórico no navegador

## Para quem serve

- Oficinas
- Assistências técnicas
- Gráficas
- Vidraçarias
- Marceneiros
- Prestadores de serviço
- Agências pequenas

## Como funciona

O usuário informa cliente, itens, valores e desconto. A aplicação calcula os totais automaticamente. Depois, o usuário pode copiar uma mensagem pronta para enviar ao cliente, exportar uma versão limpa para PDF e salvar o orçamento no histórico local.

## Como testar a exportação de PDF

1. Informe um cliente.
2. Escolha uma validade.
3. Adicione pelo menos um item com valor maior que zero.
4. Clique em `Exportar PDF`.
5. Na janela aberta, escolha `Salvar como PDF` na impressão do navegador.

## Tecnologias

- HTML
- CSS
- JavaScript
- LocalStorage
- Clipboard API
- Impressão do navegador para PDF

## Como rodar

Abra o arquivo `index.html` no navegador.

## Melhorias futuras

- Enviar direto para WhatsApp
- Cadastro de clientes
- Cadastro de produtos frequentes
- Login e banco de dados
- Painel administrativo
