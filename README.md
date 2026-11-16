# Descarte Consciente

Guia Digital para Descarte Correto de Resíduos em Comunidade Residencial — projeto de extensão do curso de Análise e Desenvolvimento de Sistemas, Universidade Cruzeiro do Sul, 2026/2.

## Estrutura

```text
index.html                           # conteúdo e estrutura semântica
css/styles.css                       # estilos, responsividade e impressão
js/script.js                         # calendário, consulta, checklist e menu
assets/illustrations/hero.svg        # ilustração principal
assets/illustrations/favicon.svg     # ícone do navegador
assets/images/qrcode-descarte-consciente.png
README.md
```

## Executar localmente

Abra esta pasta no VS Code. Abra `index.html` no navegador ou use a extensão Live Server. Não há dependências externas, compilação nem instalação de pacotes. Para testar por HTTP, também é possível executar `python -m http.server 8000` na pasta do projeto e acessar `http://localhost:8000`.

## Publicar

Copie os arquivos e as pastas para a raiz do repositório existente `descarte-correto-de-residuos`, preservando a estrutura. A página inicial deve ser `index.html` (minúsculo). Configure GitHub Pages para publicar a partir da branch e pasta já utilizadas. Por exemplo, para publicação na raiz da branch principal:

```bash
git status
git add index.html css js assets README.md
git commit -m "Organiza estrutura do guia de descarte consciente"
git push
```

Endereço esperado: https://amandapardini-22.github.io/descarte-correto-de-residuos/

O QR Code existente aponta para esse endereço. Se a URL mudar, será necessário atualizar a imagem e o texto do endereço no HTML.

## Manutenção

- Dias de coleta: atualizar o calendário e os textos de orientação no HTML e as regras e respostas em `js/script.js`. A rotina atual foi informada pelos moradores e precisa ser confirmada no serviço municipal. O calendário não é uma integração com dados em tempo real.
- Consulta de resíduos: manter as opções do seletor no HTML em correspondência com as chaves do objeto `guidance` em `js/script.js`.
- Estilos de impressão: seção `@media print` em `css/styles.css`. O botão de imprimir permite salvar em PDF na caixa de impressão do navegador.
- Referências e ODS: seção correspondente no HTML. ODS 3 principal e ODS 12 complementar.
- O checklist é local à página; não envia nem armazena os dados.

Não inclui fotografias de moradores nem resultados de intervenção não confirmados.
