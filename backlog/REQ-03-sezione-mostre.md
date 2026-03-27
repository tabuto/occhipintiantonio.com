# REQ-03 — Sezione Mostre

## Contesto

L'elenco storico delle mostre (1956–2009) esiste in `content/it/mostre.md` ma non è accessibile dalla navigazione del sito.

## Obiettivo

Aggiungere la sezione Mostre nella navigazione e nel layout, renderizzandone il contenuto Markdown.

## Requisiti

- [ ] Aggiungere voce **Mostre** nel `<nav>` principale con anchor `#mostre`
- [ ] Aggiungere `<section id="mostre">` nell'`index.html`, posizionata tra la gallery e la sezione *Chi sono*
- [ ] Caricare e renderizzare `content/{lang}/mostre.md` tramite `marked.js` nel nodo `#mostre-content` (stesso pattern di REQ-01)
- [ ] Il layout deve rispettare lo stile tipografico delle altre sezioni: `max-width`, padding, headings serif
- [ ] In `css/styles.css` aggiungere stile per le intestazioni `## Anno` (es. colore `powder`, grassetto) per rendere la cronologia leggibile

## Criteri di accettazione

- La voce "Mostre" è visibile nel menu di navigazione
- Cliccando "Mostre" lo scroll porta alla sezione corretta
- Il contenuto mostra la cronologia delle mostre con le intestazioni anno evidenziate in `powder`
- La sezione è responsive (mobile/tablet/desktop)
- Al cambio lingua (REQ-02), il contenuto si aggiorna

## File coinvolti

- `index.html`
- `css/styles.css`
- `content/it/mostre.md` (esistente)
- `content/en/mostre.md` (da creare — vedi REQ-02)

## Dipendenze

- REQ-01 (pattern fetch Markdown)
- REQ-02 (store lingua)

## Note

- `content/it/mostre.md` usa headings `## ANNO` per ogni anno; lo stile CSS deve targetizzare `#mostre-content h2`
- Valutare se aggiungere `sticky` o `top` alla nav per mantenere l'accessibilità con l'anchor link
