# REQ-09 — SEO e metatag Open Graph

## Contesto

L'`<head>` contiene solo il meta `description` di base. Mancano i tag necessari per la condivisione social (Open Graph, Twitter Card) e per il posizionamento SEO.

## Obiettivo

Aggiungere tutti i metatag SEO e Open Graph nell'`<head>` di `index.html`.

## Requisiti

### Open Graph
- [ ] `<meta property="og:title" content="Antonio Occhipinti — Portfolio">`
- [ ] `<meta property="og:description" content="…">` (stesso testo del meta description)
- [ ] `<meta property="og:image" content="https://occhipintiantonio.com/img/og-image.jpg">` (immagine da creare o selezionare)
- [ ] `<meta property="og:url" content="https://occhipintiantonio.com">`
- [ ] `<meta property="og:type" content="website">`

### Twitter Card
- [ ] `<meta name="twitter:card" content="summary_large_image">`
- [ ] `<meta name="twitter:title" content="Antonio Occhipinti — Portfolio">`
- [ ] `<meta name="twitter:description" content="…">`
- [ ] `<meta name="twitter:image" content="https://occhipintiantonio.com/img/og-image.jpg">`

### Canonical e autore
- [ ] `<link rel="canonical" href="https://occhipintiantonio.com">`
- [ ] `<meta name="author" content="Antonio Occhipinti">`

### Favicon
- [ ] Aggiungere `<link rel="icon">` con favicon SVG placeholder (es. iniziali "AO" su sfondo `powder`) oppure `favicon.ico`

## Criteri di accettazione

- Condividendo l'URL su Telegram/WhatsApp/LinkedIn appare l'anteprima con immagine e titolo
- Google Search Console non riporta errori relativi ai metatag
- Nessun warning "missing canonical" nei tool SEO

## File coinvolti

- `index.html`

## Dipendenze

Nessuna — task autonomo.

## Note

- L'URL di produzione è `https://occhipintiantonio.com`
- Selezionare un'opera significativa come `og:image` (es. prima immagine disponibile in gallery)
- Il favicon SVG può essere inline nell'`<head>` oppure un file separato in `img/favicon.svg`
