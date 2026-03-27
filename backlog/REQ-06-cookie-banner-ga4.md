# REQ-06 — Cookie Banner e integrazione GA4

## Contesto

Nessun sistema di tracciamento è presente. L'integrazione Google Analytics 4 è richiesta nel rispetto del GDPR: il consenso deve essere esplicito prima di caricare qualsiasi script di tracking.

## Obiettivo

Implementare cookie banner GDPR-compliant con caricamento condizionale di GA4.

## Requisiti

- [ ] Creare `js/cookie.js` con la logica del banner:
  - Al caricamento della pagina, leggere `localStorage` con chiave `cookie_consent`
  - Se il valore non esiste o è scaduto (>6 mesi dalla data di consenso), mostrare il banner
  - Il banner offre due azioni: **Accetta** e **Rifiuta**
  - Su *Accetta*: salvare `{ value: 'accepted', date: Date.now() }` in `localStorage['cookie_consent']` e caricare GA4
  - Su *Rifiuta*: salvare `{ value: 'rejected', date: Date.now() }` e non caricare GA4
- [ ] Caricare lo snippet GA4 (`gtag.js`) **solo dopo** il consenso esplicito (inserimento dinamico del `<script>` nel DOM)
- [ ] Il banner deve essere stilisticamente coerente con la palette del sito (`canvas`, `ink`, `powder`)
- [ ] Aggiungere nel footer un link **Privacy Policy** che punta a `/privacy.html`
- [ ] Creare `privacy.html` (vedi REQ-10 per il contenuto; questo task gestisce solo il link footer)

## Criteri di accettazione

- Al primo accesso il banner appare (prima di qualsiasi scroll)
- Cliccando *Accetta*, il banner scompare e GA4 viene caricato (verificabile in DevTools → Network)
- Cliccando *Rifiuta*, il banner scompare e GA4 **non** viene caricato
- Tornando sul sito entro 6 mesi, il banner non riappare
- Dopo 6 mesi dalla scelta, il banner riappare
- Il footer mostra il link "Privacy Policy"

## File coinvolti

- `index.html`
- `js/cookie.js` (da creare)
- `privacy.html` (da creare — contenuto dettagliato in REQ-10)

## Dipendenze

- REQ-10 (creazione di `privacy.html`) può procedere in parallelo

## Note

- Il GA4 Measurement ID va inserito come variabile configurabile in `js/cookie.js` (es. `const GA_ID = 'G-XXXXXXXXXX'`)
- Nessun bundler: tutto in vanilla JS
- Il banner può usare Alpine.js (già presente) oppure DOM puro — preferire Alpine.js per coerenza
