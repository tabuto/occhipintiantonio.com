# REQ-15 — Riorganizzazione sezione "Documenti" (schede)

## Sommario
Task per riorganizzare la sezione Documenti: mostrare elenchi raggruppati per tipologia e aprire ogni elemento in una "scheda" dedicata. Le schede sono pagine HTML generate nella cartella `scheda/` e descritte da file Markdown sotto `content/`. Questo file descrive la proposta tecnica; non eseguire l'implementazione.

## Obiettivo
- Migliorare la navigazione e la consultazione dei documenti raggruppandoli per tipologia.
- Ogni documento deve avere una scheda dedicata (pagina HTML) con titolo, immagine principale e contenuto testuale con eventuali immagini aggiuntive.
- I sorgenti testuali delle schede restano file `.md` sotto `content/`.

## Requisiti funzionali
1. La pagina di elenco (Documenti) mostra elenchi raggruppati per "tipologia" (es. Relazioni, Volture, Articoli, Verbali, ecc.).
2. Ogni elemento dell'elenco è cliccabile e apre la scheda corrispondente.
3. Ogni scheda è una pagina HTML sotto `scheda/<slug>.html`.
4. Il contenuto delle schede è scritto in Markdown e salvato in `content/` (uno .md per scheda).
5. Ogni file .md deve contenere metadata (frontmatter) con almeno: title, tipologia, image (main), optional images (gallery), slug (opzionale), excerpt.
6. Le immagini associate sono salvate in `img/` (o sottocartelle dedicate) e referenziate con percorsi relativi.
7. ogni scheda renderizza il proprio markdown.md (stesso meccanismo del resot del sito)
8. nuova pagina elenco_documenti.html, nuovo markdown elenco_documenti.md che descrive la nuova pagina con l'elenco dei documenti e relativi link; nuova cartella /it/docs/ contenente i singoli documenti.

## Requisiti non funzionali
- SEO-friendly: ogni scheda avrà tag meta essenziali (title, description, canonical).
- Accessibilità: immagini con attributo alt, struttura semantica (h1, nav, main, footer).
- Responsive: layout mobile-first.
- Performance: preferibile generazione static HTML a build-time per evitare overhead runtime.



### Template scheda (contenuti minimi)
- header / breadcrumb (link a Documenti)
- title (h1)
- immagine principale (con alt)
- data/metadati (tipologia, data)
- corpo HTML (convertito da Markdown)
- galleria immagini (thumbnails + lightbox opzionale)
- footer / link indietro

### nuova pagina elenco documenti (elenco_documenti.html)
- Raggruppare i documenti per `tipologia`. Ogni gruppo con heading.
- Ogni elemento mostra thumbnail (image), title e excerpt.
- Link verso `scheda/<slug>.html`.
- Possibilità di filtro/search in JS (progressivo enhancement).

## Migrazione contenuti (passaggi suggeriti)
1. Creare `content/it/docs/` e creare i file `.md` delle schede (aggiungere frontmatter dove mancante).
2. Organizzare immagini in `img/documents/<slug>/`.
3. Preparare template HTML per la scheda.
5. Aggiungere all'index.html il link alla nuova sezione `elenco_documenti.html` per verificare la nuova impostazione.

## Acceptance criteria
- Documenti sono mostrati su elenco_documenti.html raggruppati per tipologia.
- Clic su elemento apre `scheda/<slug>.html` con title, image principale e corpo completo.
- Tutte le schede sono generate a partire da `content/id/docs/*.md` e le immagini sono servite da `img/`.
- Template rispetta accessibilità minima (alt, heading semantici) e meta description.

---

## Piano di implementazione

### Fase 1 — Struttura dati e contenuti

**1. Creare la cartella dei contenuti**
- Creare `content/it/docs/` e `content/en/docs/`.

**2. Scrivere i file Markdown delle schede**
Per ogni documento già presente in `content/it/documenti.md`, creare un file `.md` dedicato in `content/it/docs/<slug>.md`.
Frontmatter minimo richiesto:
```yaml
---
title: "Titolo del documento"
tipologia: "Lettere autografe"   # valore usato per raggruppare l'elenco
slug: "nome-file-senza-estensione"
date: "YYYY-MM-DD"               # o solo anno
image: "img/documents/<slug>/main.jpg"
images: []                       # galleria opzionale
excerpt: "Breve descrizione per l'anteprima nell'elenco."
lang: "it"
---
```
Documenti da creare (ricavati da `content/it/documenti.md`):
- `dedica-annigoni-1982.md` — tipologia: Lettere autografe
- `dedica-buttitta-1981.md` — tipologia: Lettere autografe
- `lettera-livi-1984.md` — tipologia: Lettere autografe
- `catalogo-fabriano-1987.md` — tipologia: Pubblicazioni e cataloghi
- `catalogo-roma-fiat-1995.md` — tipologia: Pubblicazioni e cataloghi
- `attestato-aib-1999.md` — tipologia: Attestati
- `settegiorni-2025.md` — tipologia: Articoli di stampa

**3. Organizzare le immagini**
- Creare `img/documents/<slug>/` per ogni scheda con immagine.
- Le immagini Cloudinary esistenti possono restare come URL remoti nei `.md`; le future dovranno risiedere in `img/documents/`.

---

### Fase 2 — Index JSON (opzionale ma raccomandato)

**4. Creare `data/documenti-index.json`**
File generato (o mantenuto a mano) che aggrega tutti i frontmatter per alimentare la pagina elenco senza caricare ogni singolo `.md`:
```json
[
  {
    "slug": "dedica-annigoni-1982",
    "title": "Dedica autografa di Pietro Annigoni",
    "tipologia": "Lettere autografe",
    "date": "1982-11",
    "image": "...",
    "excerpt": "..."
  },
  ...
]
```
Questo evita N fetch in parallelo nella pagina elenco.

---

### Fase 3 — Pagina elenco

**5. Creare `elenco_documenti.html`**
Struttura analoga a `documenti.html` (stesso header/footer/cookie-banner/Tailwind/Alpine).
Logica Alpine:
- Fetch di `data/documenti-index.json`.
- Raggruppamento per `tipologia` con `reduce`.
- Rendering: per ogni gruppo un `<section>` con heading `<h2>` e griglia di card (thumbnail + title + excerpt).
- Ogni card linka a `scheda/<slug>.html`.
- Campo `<input>` di ricerca opzionale che filtra in JS sul client (progressive enhancement).

**6. Aggiornare `content/it/elenco_documenti.md`** (e versione EN)
Testo introduttivo breve per la pagina elenco, caricato con lo stesso pattern `markdownPage` già usato su `documenti.html`.

---

### Fase 4 — Template scheda

**7. Creare `scheda/template.html` → `scheda/<slug>.html`**
Ogni scheda è un file HTML statico (copiato dal template e personalizzato, oppure generato da script).
Struttura della scheda:
```
<header> breadcrumb → Documenti / elenco_documenti.html
<main>
  <h1> title
  <figure> immagine principale + alt
  <p class="meta"> tipologia · data
  <div id="scheda-content"> corpo da Markdown (marked.js + fetch del .md corrispondente)
  <section class="gallery"> eventuali immagini aggiuntive
<footer> link indietro + copyright
```
Usare lo stesso pattern `markdownPage(slug)` di `documenti.html` puntando a `content/it/docs/<slug>.md`.

**8. Decidere: HTML statico vs. HTML unico parametrico**
- Opzione A (raccomandato per ora): un file `scheda.html` generico che legge `?doc=<slug>` dall'URL e carica il `.md` corrispondente. Meno file, più semplice da mantenere.
- Opzione B: un file `.html` per ogni documento (migliore per SEO, richiede un passo di generazione).
La scelta va finalizzata prima di iniziare la fase 4.

---

### Fase 5 — Navigazione e integrazione

**9. Aggiornare `index.html`**
- Aggiungere link/card alla sezione "Documenti" che punta a `elenco_documenti.html` (in sostituzione o affiancamento di `documenti.html`).

**10. Aggiornare `documenti.html`** (opzionale)
- Aggiungere un banner o link prominente che rimanda a `elenco_documenti.html` per non rompere i link esistenti.

**11. Aggiornare `sitemap.xml`**
- Aggiungere `elenco_documenti.html` e, se si usa opzione B, tutte le URL `scheda/<slug>.html`.

---

### Fase 6 — Internazionalizzazione

**12. Creare i file EN corrispondenti**
- `content/en/docs/<slug>.md` per ogni scheda (anche solo con traduzione di title ed excerpt inizialmente).
- `content/en/elenco_documenti.md` per il testo introduttivo in inglese.
- Il meccanismo di fallback a `it` già presente in `markdownPage()` gestisce i `.md` mancanti.

---

### Stima ordine di esecuzione

| Passo | Dipendenze | Note |
|-------|-----------|------|
| 1–3   | — | Prerequisito per tutto il resto |
| 4     | 2 | Può essere creato a mano o con script |
| 5–6   | 4 | Blocco principale UI |
| 7–8   | 2 | Decisione Opzione A/B prima |
| 9–11  | 5, 7 | Integrazione finale |
| 12    | 2–7 | Può essere posticipato |


