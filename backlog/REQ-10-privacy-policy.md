# REQ-10 — Pagina Privacy Policy

## Contesto

Richiesta da REQ-06 (cookie banner). Deve esistere come pagina HTML separata con layout coerente al sito principale.

## Obiettivo

Creare `privacy.html` con informativa GDPR completa, stile coerente e link di ritorno al sito.

## Requisiti

- [ ] Creare `privacy.html` con lo stesso `<head>` del sito (Tailwind CDN, Google Fonts, `css/styles.css`)
- [ ] Header con il nome dell'artista e link **← Torna al sito** che punta a `/`
- [ ] Contenuto GDPR minimo obbligatorio:
  - **Titolare del trattamento**: Antonio Occhipinti — `occhipinti.antonio.fam@gmail.com`
  - **Dati raccolti**: dati di navigazione aggregati (GA4), nessun dato personale diretto
  - **Finalità**: analisi statistica del traffico (miglioramento del sito)
  - **Cookie tecnici**: sessione, preferenza lingua (`lang`)
  - **Cookie analitici**: Google Analytics 4 (solo previo consenso)
  - **Base giuridica**: consenso esplicito (Art. 6 GDPR)
  - **Diritti dell'utente**: accesso, rettifica, cancellazione, portabilità, opposizione
  - **Contatto per esercizio diritti**: `occhipinti.antonio.fam@gmail.com`
  - **Conservazione dati**: 6 mesi per il consenso cookie
- [ ] Footer con lo stesso copyright del sito principale: `© <anno> Antonio Occhipinti. Tutti i diritti riservati.`
- [ ] Pagina responsive (stessa griglia del sito)

## Criteri di accettazione

- `privacy.html` è accessibile all'URL `/privacy.html`
- Il layout è visivamente coerente con `index.html` (stessa palette, stesso font)
- Il link "← Torna al sito" riporta a `index.html`
- Tutti i punti GDPR sono presenti e leggibili
- Il footer mostra il copyright con l'anno corrente

## File coinvolti

- `privacy.html` (da creare)

## Dipendenze

- REQ-06 crea il link nel footer di `index.html` che punta a questa pagina

## Note

- Il titolare del trattamento è una persona fisica (Antonio Occhipinti) — non è necessaria la figura del DPO
- Se in futuro viene aggiunto un form di contatto, aggiornare la privacy policy di conseguenza
- La pagina non necessita di Alpine.js (contenuto statico)
