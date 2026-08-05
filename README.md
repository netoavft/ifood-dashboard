# Banco de dados de pedidos iFood — guia rápido

Estes 3 arquivos são o que precisamos para ligar o banco de dados de verdade:

- **`schema.sql`** — cria as tabelas `dim_lojas` e `fato_pedidos` (e uma view pronta `vw_pedidos_financeiro`).
- **`import_pedidos.py`** — lê os arquivos Excel do iFood e insere no banco, aplicando todas as regras já validadas (SEMANA, DIA DA SEMANA, TIPO DE PAGAMENTO, etc.), sem duplicar pedidos.
- **`requirements.txt`** — lista das bibliotecas Python que o script precisa.

## O que já foi testado

Rodei a lógica de transformação do `import_pedidos.py` contra os dados reais desta análise (2.599 pedidos) e os totais bateram exatamente com os números já validados: Bruto R$ 183.436,79 e Líquido R$ 134.865,47. A parte que falta testar é a conexão real com o banco — isso só é possível no Claude Code, porque este ambiente de chat não tem acesso à internet.

## Passo a passo (vamos fazer isso juntos no Claude Code)

1. **Criar uma conta gratuita** em um provedor de banco de dados (ex: Supabase, Railway ou Neon). Isso é só clicar em "criar conta" e "criar projeto" — eu te aviso exatamente onde clicar.
2. **Copiar a "connection string"** que o provedor gera (é um texto tipo `postgresql://usuario:senha@endereco:5432/nome_do_banco`).
3. **Rodar o `schema.sql`** uma única vez, para criar as tabelas.
4. **Rodar o `import_pedidos.py`** com a planilha de maio (o teste que você quer fazer), apontando para o `LOJAS.xlsx` e para o arquivo de pedidos.
5. **Conferir os números** — eu confirmo que bateram com o que já validamos aqui no chat.
6. Nos dias seguintes, é só rodar o mesmo comando com o arquivo novo — o script nunca duplica pedidos que já estão no banco.

## Comando de exemplo (isso vai rodar no Claude Code, não aqui)

```bash
export DATABASE_URL="postgresql://usuario:senha@endereco:5432/nome_do_banco"
python import_pedidos.py --lojas LOJAS.xlsx --pedidos relatorio_maio.xlsx
```

Se algum dia aparecer uma forma de pagamento nova que o script não souber classificar, ele avisa no terminal — nunca inventa uma classificação sem te contar.
