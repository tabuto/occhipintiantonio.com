# REQ-01 — Rendering Markdown in pagina

## Contesto

Le sezioni *Chi sono* e *Contatti* hanno contenuto testuale hardcoded come placeholder HTML. I file `.md` in `content/it/` esistono già ma non vengono mai caricati.

## Obiettivo

Caricare e renderizzare i file Markdown tramite `marked.js` al mount del componente Alpine.js.

## Requisiti

- [ ] Importare `marked.js` via CDN nell'`<head>` di `index.html` (prima di Alpine.js)
- [ ] Al mount del componente Alpine.js, eseguire `fetch('content/{lang}/about.md')` e popolare `#about-content` con l'HTML generato da `marked.parse()`
- [ ] Stessa logica per `content/{lang}/contatti.md` → nodo `#contact-content`
- [ ] Gestire errori di fetch (rete, file assente) mostrando un messaggio di fallback visibile all'utente
- [ ] La lingua `{lang}` è letta dallo store globale Alpine.js `Alpine.store('i18n').lang` (vedi REQ-02)

## Criteri di accettazione

- Aprendo il sito, la sezione *Chi sono* mostra il contenuto renderizzato da `content/it/about.md`
- La sezione *Contatti* mostra il contenuto renderizzato da `content/it/contatti.md`
- Se il file `.md` non è raggiungibile, appare un messaggio di fallback (non una pagina vuota o errore JS)
- Il markup generato rispetta la tipografia esistente (headings serif, paragrafi con interlinea corretta)

## File coinvolti

- `index.html`
- `content/it/about.md` (esistente)
- `content/it/contatti.md` (esistente)

## Dipendenze

- REQ-02 (store `i18n`) deve essere implementato prima o in parallelo

## Note

- `Alpine.js` è caricato con `defer`: non usare `DOMContentLoaded`, usare `x-init` o `Alpine:init`
- Verificare che `marked.parse()` sia disponibile globalmente dopo l'import CDN
