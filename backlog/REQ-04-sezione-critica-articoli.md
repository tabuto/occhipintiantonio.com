# REQ-04 — Sezione Critica / Articoli

## Contesto

`content/it/articoli.md` esiste ma è un placeholder ("in aggiornamento"). La sezione non è presente nella navigazione.

## Obiettivo

Aggiungere la sezione *Critica* nella navigazione e nel layout, pronta a ricevere i testi reali di critica e rassegna stampa.

## Requisiti

- [ ] Aggiungere voce **Critica** nel `<nav>` principale con anchor `#critica`
- [ ] Aggiungere `<section id="critica">` nell'`index.html`
- [ ] Caricare e renderizzare `content/{lang}/articoli.md` tramite `marked.js` nel nodo `#critica-content`
- [ ] Mantenere il messaggio "in aggiornamento" in `content/it/articoli.md` fino a quando i testi reali non sono disponibili
- [ ] Creare `content/en/articoli.md` con messaggio equivalente in inglese

## Criteri di accettazione

- La voce "Critica" è visibile nel menu di navigazione
- Cliccando "Critica" lo scroll porta alla sezione corretta
- La sezione mostra il contenuto di `articoli.md` renderizzato (anche solo il placeholder)
- Al cambio lingua, il contenuto si aggiorna
- Quando i testi reali saranno aggiunti al file `.md`, appariranno automaticamente senza modifiche al codice

## File coinvolti

- `index.html`
- `content/it/articoli.md` (esistente, placeholder)
- `content/en/articoli.md` (da creare — vedi REQ-02)

## Dipendenze

- REQ-01 (pattern fetch Markdown)
- REQ-02 (store lingua)

## Note

- Il contenuto reale (testi critici, rassegna stampa) sarà fornito in un secondo momento
- La struttura del task è deliberatamente minimale per permettere l'aggiornamento dei contenuti in modo indipendente dal codice
