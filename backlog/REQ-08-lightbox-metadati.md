# REQ-08 — Lightbox: titolo e dettagli opera

## Contesto

Il lightbox attuale mostra solo l'immagine full-size. Nessun metadato dell'opera (titolo, anno, tecnica, categoria) è visibile durante la visualizzazione.

## Obiettivo

Aggiungere un blocco informativo con i metadati dell'opera nel lightbox, visibile senza nascondere l'immagine.

## Requisiti

- [ ] Aggiungere nel lightbox un blocco con:
  - **Titolo** — font serif (Playfair Display), prominente
  - **Dettagli** — anno e tecnica (font Inter, dimensione ridotta)
  - **Categoria** — etichetta/badge
- [ ] Il blocco deve essere su sfondo semiopaco (es. `bg-black/60`) per garantire leggibilità senza coprire l'immagine
- [ ] **Mobile**: blocco posizionato sotto l'immagine
- [ ] **Desktop**: blocco posizionato sotto o a lato dell'immagine (valutare il layout)
- [ ] I dati devono provenire dall'oggetto opera già passato al lightbox (`$store.lightbox.current`)

## Criteri di accettazione

- Aprendo il lightbox, titolo, dettagli e categoria dell'opera sono visibili
- Su mobile il blocco è sotto l'immagine, non sovrapposto
- Su desktop il blocco è elegantemente integrato nel layout
- Il testo è leggibile (contrasto sufficiente con lo sfondo scuro del lightbox)
- Il comportamento di chiusura (tasto × e ESC) rimane invariato

## File coinvolti

- `index.html` (struttura HTML del lightbox)
- `css/styles.css` (stili del blocco metadati)

## Dipendenze

- REQ-07 (immagini reali con metadati corretti)

## Note

- Lo store `$store.lightbox` è già presente in `index.html`; aggiungere una proprietà `current` (o `artwork`) per tenere l'opera selezionata
- Verificare che il markup del lightbox sia accessibile (ARIA già parzialmente implementato)
