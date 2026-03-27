# REQ-07 — Sincronizzazione immagini gallery

## Contesto

`data/gallery.json` dichiara 9 opere ma la directory `/img/art/` non esiste. Tutte le immagini risultano broken. Le immagini reali di Antonio Occhipinti si trovano in `bucket/img/gallery/` (non ancora presente nel repo).

## Obiettivo

Allineare `gallery.json` alle opere con immagini fisicamente presenti e aggiornare titoli, categorie e dettagli in base alla produzione reale dell'artista.

## Requisiti

- [ ] Creare la directory `img/art/`
- [ ] Valutare e integrare le immagini da `bucket/img/gallery/` (sottocartelle: `ritratti/`, `marine/`, `arte_sacra/`, `figure/`, `nudi/`, `paesaggi/`)
- [ ] Per ogni opera nel JSON devono esistere:
  - Immagine full-size: `img/art/<slug>-<id>.jpg`
  - Thumbnail: `img/art/thumb_<slug>-<id>.jpg`
- [ ] Aggiornare `data/gallery.json` con titoli, categorie e dettagli reali
- [ ] Le categorie devono riflettere la produzione reale: **Paesaggi, Marine, Ritratti, Arte Sacra, Figure, Nudi**
- [ ] Rimuovere da `gallery.json` le 9 voci placeholder (Tramonto sul Lago, Nebbia Mattutina, ecc.) e sostituirle con opere reali

## Struttura attesa di gallery.json (per ogni opera)

```json
{
  "title": "Titolo Opera",
  "category": "Marine",
  "image": "/img/art/titolo-opera-1.jpg",
  "thumb": "/img/art/thumb_titolo-opera-1.jpg",
  "details": "Anno, Tecnica, Supporto"
}
```

## Criteri di accettazione

- Nessuna immagine broken nella gallery
- I filtri per categoria mostrano le opere raggruppate correttamente
- Tutte le immagini hanno la corrispondente thumbnail
- Il lightbox mostra l'immagine full-size senza errori 404

## File coinvolti

- `data/gallery.json`
- `img/art/` (da creare)
- `bucket/img/gallery/` (sorgente immagini — da verificare disponibilità)

## Dipendenze

Nessuna dipendenza da altri REQ, ma REQ-08 dipende da questo.

## Note

- `gallery.json` **non va modificato manualmente in produzione** (riservato al backoffice) — questa è l'eccezione iniziale per il setup
- Usare sempre path assoluti: `/img/art/…`
- Le thumbnail possono essere versioni ridimensionate (es. 400px larghezza) delle full-size
