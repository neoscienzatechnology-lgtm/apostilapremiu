Sincronização local — Export / Import de dados
=============================================

Este arquivo descreve como funciona a nova funcionalidade de sincronização local adicionada à apostila.

O que faz
- Exporta todo o conteúdo do `localStorage` como um arquivo JSON (nome padrão: `apostila-data.json`).
- Importa um arquivo JSON no mesmo formato e grava as chaves/valores no `localStorage` do navegador.

Como usar
1. Abra a página `apostila-javascript-premium.html` no navegador.
2. No canto inferior direito haverá um botão flutuante "Sincronizar".
3. Clique no botão para abrir o modal de sincronização.
4. Para exportar: clique em `Exportar dados` — o navegador irá baixar um arquivo JSON com todo o `localStorage`.
5. Para importar: escolha um arquivo JSON (ou arraste para o campo) e clique em `Importar arquivo`. Você será solicitado a confirmar.

Observações importantes
- A importação sobrescreve chaves existentes no `localStorage` sem mesclagem seletiva.
- O arquivo contém todas as chaves presentes no `localStorage`. Se deseja apenas backups de certas chaves, abra o JSON e remova o restante antes de importar.
- Após importar, recarregue a página para que os dados aplicados entrem em efeito.

Sugestões futuras
- Adicionar filtros para exportar apenas chaves relevantes (por exemplo: `notes_*`, `srs_*`, `exercise_attempts_v1`).
- Oferecer modo de mesclagem: "mesclar" vs "sobrescrever" quando houver conflito de chaves.
- Armazenamento encriptado para maior privacidade.

Arquivos alterados
- `js/sync.js` — novo módulo que adiciona botão flutuante e modal para export/import.
- `apostila-javascript-premium.html` — incluiu `<script src="./js/sync.js"></script>`.

Testes rápidos
- Exporte e abra o JSON localmente para inspecionar.
- Use um perfil de navegador limpo para testar a importação sem sobrescrever dados reais.

Licença
- Mantém-se sob a mesma licença do projeto.
