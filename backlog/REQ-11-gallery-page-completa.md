# REQ-11 — Pagina Gallery completa

## Contesto

La homepage carica una selezione di opere da `data/gallery.json`, ma serve una pagina dedicata che mostri l'archivio completo delle opere utilizzando `data/complete-gallery.json`.

## Obiettivo

Creare una nuova pagina `gallery.html` che recuperi i dati da `data/complete-gallery.json` e renderla accessibile dalla navigazione principale della homepage.

## Requisiti

- [ ] Creare `gallery.html` con lo stesso `<head>` del sito (Tailwind CDN, Google Fonts, `css/styles.css`, Alpine.js)
- [ ] Caricare `data/complete-gallery.json` tramite `fetch()` lato client
- [ ] Visualizzare le opere in una griglia responsive coerente con quella attuale della homepage
- [ ] Riutilizzare filtri per categoria e lightbox, oppure estrarre la logica condivisa in JS senza duplicazioni inutili
- [ ] Gestire stato di caricamento ed errori di fetch con messaggi visibili
- [ ] Inserire in `index.html` un link alla nuova pagina Gallery nella navigazione principale
- [ ] Rendere coerente il label del link con il sistema bilingue del sito

## Criteri di accettazione

- La pagina `gallery.html` si apre correttamente dal menu principale
- Le opere vengono caricate da `data/complete-gallery.json` senza dipendere da `data/gallery.json`
- La griglia è responsive su mobile e desktop
- Filtri e lightbox funzionano anche nella nuova pagina
- In caso di errore di caricamento, l'utente vede un messaggio esplicito

## File coinvolti

- `gallery.html` (da creare)
- `data/complete-gallery.json`
- `index.html`
- `js/app.js` oppure nuovo file JS dedicato

## Dipendenze

Nessuna dipendenza obbligatoria, ma l'implementazione dovrebbe riutilizzare i pattern già presenti nella gallery della homepage.

## Note

- Al momento `data/complete-gallery.json` non risulta presente nel repo: va aggiunto o generato durante l'implementazione
- Evitare di introdurre una seconda implementazione divergente della gallery se è possibile condividere la logica esistente
