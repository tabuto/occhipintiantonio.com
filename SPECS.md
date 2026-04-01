# SPECS — Portfolio Antonio Occhipinti

Requisiti tecnico-funzionali del sito. Ogni requisito è formulato in modo da corrispondere a un task di implementazione autonomo e verificabile.

---

## Stack tecnologico attuale

| Componente | Dettaglio |
|---|---|
| HTML | SPA single-file (`index.html`) |
| CSS | Tailwind CSS CDN + `css/styles.css` (override) |
| JS | Alpine.js 3.x CDN (no bundler, no npm) |
| Dati gallery | `data/gallery.json` (fetch statico) |
| Contenuti testuali | File `.md` in `content/it/` e `content/en/` |
| Font | Google Fonts: Playfair Display + Inter |
| Server | Python `SimpleHTTPServer` porta 8080 (sviluppo) |

---

## REQ-01 — Rendering Markdown in pagina

**Contesto:** Le sezioni *Chi sono*, *Contatti* hanno contenuto testuale statico hardcoded come placeholder HTML. I file `.md` in `content/it/` esistono ma non vengono mai caricati.

**Requisiti:**
- Importare `marked.js` via CDN nell'`<head>` di `index.html`.
- Al mount del componente Alpine.js, eseguire `fetch('content/{lang}/about.md')` e popolare il nodo `#about-content` con l'HTML generato da `marked.parse()`.
- Fare lo stesso per `content/{lang}/contatti.md` nel nodo `#contact-content`.
- Gestire errori di fetch (rete, file assente) con un messaggio di fallback visibile.
- La lingua `{lang}` è determinata dallo stato globale (vedi REQ-02).

**File coinvolti:** `index.html`, `content/it/about.md`, `content/it/contatti.md`

---

## REQ-02 — Switcher di lingua IT / EN

**Contesto:** Il sito è pensato per utenti italiani e internazionali. I file `.md` sono già strutturati in `content/it/` e `content/en/` (la cartella `en/` è ancora da creare).

**Requisiti:**
- Aggiungere un toggle lingua (IT | EN) nel header, visivamente coerente con la palette esistente (`powder`, `ink`).
- Gestire la lingua corrente tramite un Alpine.js store globale (`Alpine.store('i18n', { lang: 'it' })`).
- Al cambio lingua, ricaricare tutti i blocchi Markdown (about, contatti, e futuri: mostre, articoli).
- Persistere la preferenza lingua in `localStorage` con chiave `lang`.
- Al caricamento della pagina, leggere `localStorage` per ripristinare la lingua scelta; default: `it`.
- Creare la struttura `content/en/` con i file speculari a `content/it/` (about.md, contatti.md, mostre.md, articoli.md).

**File coinvolti:** `index.html`, `content/en/*.md` (da creare)

---

## REQ-03 — Sezione Mostre

**Contesto:** L'elenco storico delle mostre (1956–2009) esiste in `content/it/mostre.md` ma non è accessibile dalla navigazione.

**Requisiti:**
- Aggiungere la voce **Mostre** nel menu di navigazione principale (`<nav>`) con anchor `#mostre`.
- Aggiungere la sezione `<section id="mostre">` nell'`index.html` tra la gallery e la sezione about.
- Caricare e renderizzare `content/{lang}/mostre.md` tramite marked.js nel nodo `#mostre-content` (stesso pattern REQ-01).
- La sezione deve avere lo stesso layout tipografico delle altre sezioni (max-width, padding, headings serif).
- Applicare uno stile specifico alle intestazioni `## Anno` (es. in grassetto `powder`) per rendere la cronologia leggibile.

**File coinvolti:** `index.html`, `css/styles.css`, `content/it/mostre.md`, `content/en/mostre.md`

---

## REQ-04 — Sezione Critica / Articoli

**Contesto:** `content/it/articoli.md` esiste ma è un placeholder. La sezione non è presente nella navigazione.

**Requisiti:**
- Aggiungere la voce **Critica** nel menu di navigazione con anchor `#critica`.
- Aggiungere la sezione `<section id="critica">` nell'`index.html`.
- Caricare e renderizzare `content/{lang}/articoli.md` con marked.js nel nodo `#critica-content`.
- Popolare `content/it/articoli.md` con i testi reali di critica e rassegna stampa (quando disponibili); fino ad allora mantenere la nota "in aggiornamento" già presente.

**File coinvolti:** `index.html`, `content/it/articoli.md`, `content/en/articoli.md`

---

## REQ-05 — Correzione email di contatto

**Contesto:** La sezione contatti in `index.html` contiene l'email placeholder `giulia@example.com`.

**Requisiti:**
- Sostituire `mailto:giulia@example.com` con `mailto:occhipinti.antonio.fam@gmail.com`.
- Aggiornare il testo del link visibile di conseguenza.
- Verificare coerenza con il valore in `content/it/contatti.md`.

**File coinvolti:** `index.html`

---

## REQ-06 — Cookie Banner e integrazione GA4

**Contesto:** Nessun sistema di tracciamento è attualmente presente. L'integrazione di Google Analytics 4 è richiesta, nel rispetto del GDPR.

**Requisiti:**
- Implementare un cookie banner che appaia al primo accesso se non è presente consenso in `localStorage`.
- Il banner deve offrire due azioni: **Accetta** e **Rifiuta**.
- Caricare lo snippet GA4 (tag `gtag.js`) **solo dopo** il consenso esplicito dell'utente.
- Persistere il consenso in `localStorage` con chiave `cookie_consent` e valore `accepted` o `rejected`.
- Il consenso deve avere scadenza di **6 mesi** (verificata alla lettura del valore).
- Aggiungere nel footer un link **Privacy Policy** che punta a `/privacy.html`.
- Creare la pagina `privacy.html` con informativa GDPR minima (cookie, dati raccolti, titolare del trattamento: Antonio Occhipinti).
- Il banner deve essere stilisticamente coerente con la palette del sito.

**File coinvolti:** `index.html`, `privacy.html` (da creare), `js/cookie.js` (da creare)

---

## REQ-07 — Sincronizzazione immagini gallery

**Contesto:** `data/gallery.json` dichiara 9 opere ma solo 2 hanno immagini fisiche presenti in `/img/art/`. Le 7 restanti puntano a path inesistenti (broken images).

**Requisiti:**
- Allineare `gallery.json` alle sole opere con immagini fisicamente presenti, oppure aggiungere i file immagine mancanti in `/img/art/`.
- Per ogni opera devono esistere sia l'immagine full-size (`<slug>-<id>.jpg`) sia la thumbnail (`thumb_<slug>-<id>.jpg`).
- Le immagini reali di Antonio Occhipinti sono disponibili in `bucket/img/gallery/` (sottocartelle: `ritratti/`, `marine/`, `arte_sacra/`, `figure/`, `nudi/`, `paesaggi/`): valutare la migrazione.
- Aggiornare titolo, categoria e dettagli in `gallery.json` in base alle opere effettive.
- Le categorie devono riflettere la produzione reale dell'artista (es. Paesaggi, Marine, Ritratti, Arte Sacra, Figure, Nudi).

**File coinvolti:** `data/gallery.json`, `img/art/`, `bucket/img/gallery/`

---

## REQ-08 — Lightbox: titolo e dettagli opera

**Contesto:** Il lightbox mostra solo l'immagine full-size. Nessun metadato dell'opera è visibile durante la visualizzazione.

**Requisiti:**
- Aggiungere nel lightbox, sotto (o sopra) l'immagine, un blocco con: **titolo** (serif), **dettagli** (anno, tecnica), **categoria**.
- Il blocco deve essere visibile su sfondo semiopaco senza nascondere l'immagine.
- Su mobile il blocco deve essere posizionato sotto l'immagine; su desktop a lato o sotto.

**File coinvolti:** `index.html`, `css/styles.css`

---

## REQ-09 — SEO e metatag Open Graph

**Contesto:** L'`<head>` contiene solo meta `description` di base. Mancano tag per la condivisione social e per i motori di ricerca.

**Requisiti:**
- Aggiungere `<meta property="og:title">`, `og:description`, `og:image`, `og:url`, `og:type`.
- Aggiungere `<meta name="twitter:card">`, `twitter:title`, `twitter:description`, `twitter:image`.
- Aggiungere `<link rel="canonical">` con l'URL di produzione.
- Aggiungere `<meta name="author" content="Antonio Occhipinti">`.
- Creare `favicon.ico` o `<link rel="icon">` (anche un placeholder SVG).

**File coinvolti:** `index.html`

---

## REQ-10 — Pagina Privacy Policy

**Contesto:** Richiesta da REQ-06 (cookie banner). Deve esistere come pagina separata.

**Requisiti:**
- Creare `privacy.html` con layout coerente all'identità grafica del sito (stessa palette, stesso font).
- Contenuto minimo obbligatorio per GDPR: titolare del trattamento, dati raccolti, finalità, cookie tecnici vs analitici, diritti dell'utente, contatto.
- Link "Torna al sito" nel header della pagina.
- Il footer della privacy page deve includere lo stesso copyright del sito principale.

**File coinvolti:** `privacy.html` (da creare)

---

## REQ-11 — Pagina Gallery completa

**Contesto:** La homepage mostra una selezione opere caricata da `data/gallery.json`. Serve una pagina dedicata che mostri l'archivio completo usando un dataset separato.

**Requisiti:**
- Creare una nuova pagina `gallery.html` con layout coerente al sito principale (stessa palette, font e comportamento responsive).
- Caricare i dati da `data/complete-gallery.json` tramite `fetch()` lato client, senza introdurre bundler o dipendenze aggiuntive.
- Riutilizzare, dove possibile, la logica JS già presente per categorie, filtri e lightbox.
- Gestire stati di caricamento ed errore in modo coerente con `index.html`.
- Aggiungere nella navigazione principale di `index.html` un link alla nuova pagina Gallery.
- Il link deve avere etichetta localizzata (`Gallery` in IT e EN, oppure altra etichetta coerente definita in implementazione).

**File coinvolti:** `gallery.html` (da creare), `data/complete-gallery.json`, `index.html`, `js/app.js` (o file JS dedicato)

---

## Note trasversali

- **Nessun bundler**: non introdurre dipendenze npm o build step. Tutte le librerie via CDN o file locali in `js/`.
- **Path immagini assoluti**: usare sempre `/img/art/…` (dalla root), non path relativi.
- **Alpine.js è defer**: non usare `DOMContentLoaded`; l'inizializzazione avviene dopo il parsing del DOM.
- **gallery.json non va modificato manualmente** in produzione (riservato al backoffice).
- **Lingua default**: italiano (`it`). L'inglese è un'estensione futura ma la struttura dei file deve già supportarla.
