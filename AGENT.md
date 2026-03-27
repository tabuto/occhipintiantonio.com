# website/ — Modulo Frontend

Sito statico del portfolio. Viene servito direttamente da un web server o via CDN; non richiede runtime server-side.

---

## Struttura delle directory

```
website/
├── index.html          # Single-page application (unico entry point)
├── css/
│   └── styles.css      # Override CSS custom oltre Tailwind
├── js/                 # Directory per script futuri (attualmente vuota)
├── data/
│   └── gallery.json    # Sorgente dati delle opere (letta via fetch)
├── img/
│   └── art/            # Immagini originali e thumbnail delle opere
└── content/            # File Markdown per testi statici (chi-sono.md, contatti.md)
```

---

## index.html

Single-page con quattro sezioni ancorate: `#gallery`, `#about`, `#contact` e il footer.

### Dipendenze CDN (senza build step)

| Libreria | Versione | Scopo |
|---|---|---|
| Tailwind CSS | CDN | Utility classes; config inline nel `<head>` |
| Alpine.js | 3.x | Reattività dichiarativa (gallery + lightbox) |
| Google Fonts | — | `Playfair Display` (titoli serif) + `Inter` (body sans) |

### Palette Tailwind personalizzata

```js
colors: {
  canvas:  '#FCFCFC',   // sfondo pagina
  ink:     '#1A1A1A',   // testo principale
  powder:  '#7A9EB1',   // accento (tab attivi, link, separatori)
}
```

---

## css/styles.css

Override mirati che Tailwind CDN non copre:

- **Variabili CSS** `:root` che rispecchiano la palette (`--color-canvas`, `--color-ink`, `--color-powder`).
- **`.artwork-img`** — `object-fit: contain` per non ritagliare mai le opere.
- **`.tab-active` / `.tab-inactive`** — stile del bordo inferiore per i tab di categoria.
- **`.lightbox-overlay`** — sfondo semiopaco con `backdrop-filter: blur(4px)`.

---

## data/gallery.json

Array JSON piatto. Ogni elemento rappresenta un'opera:

```jsonc
{
  "title":    "Tramonto sul Lago",   // nome visualizzato
  "category": "Paesaggi",           // usato per il filtraggio
  "image":    "/img/art/<slug>.jpg", // immagine full-size (lightbox)
  "thumb":    "/img/art/thumb_<slug>.jpg", // thumbnail nella griglia
  "details":  "2023, Acquerello su carta 300g" // riga descrittiva
}
```

**Categorie presenti**: `Paesaggi`, `Ritratti`, `Astratti`.

Il file è generato (o aggiornato) dal backoffice tramite il modulo `sync_engine.py`. Non va editato manualmente in produzione.

---

## Alpine.js — Componente Gallery

Definito come funzione globale `gallery()` in fondo a `index.html`.

### Stato

| Proprietà | Tipo | Descrizione |
|---|---|---|
| `artworks` | `Array` | Tutte le opere caricate da `gallery.json` |
| `categories` | `Array<string>` | Categorie uniche, in ordine di prima comparsa |
| `activeCategory` | `string` | Categoria selezionata; default `'Tutte'` |
| `loading` | `boolean` | `true` durante il fetch |
| `error` | `string\|null` | Messaggio di errore se il fetch fallisce |

### Metodi / computed

| Nome | Tipo | Descrizione |
|---|---|---|
| `load()` | `async method` | Esegue `fetch('data/gallery.json')` e popola `artworks` e `categories` |
| `filtered` | `getter` | Restituisce `artworks` filtrati per `activeCategory` |
| `openLightbox(art)` | `method` | Delega a `$store.lb.show(art)` |

### Alpine Store — Lightbox (`Alpine.store('lb', …)`)

Gestisce lo stato globale del visualizzatore fullscreen.

| Proprietà/Metodo | Descrizione |
|---|---|
| `open` | `boolean` — visibilità overlay |
| `art` | Oggetto opera corrente (o `null`) |
| `show(art)` | Apre il lightbox con l'opera passata |
| `close()` | Chiude il lightbox e resetta `art` |

Il lightbox si chiude anche premendo **Escape** (`@keydown.escape.window`) o cliccando fuori dall'immagine (`@click.self`).

---

## img/art/

Convenzione di naming:

```
<slug>-<id>.jpg           # immagine originale (full-size)
thumb_<slug>-<id>.jpg     # thumbnail (mostrata nella griglia)
```

Le thumbnail sono pregenerate dal backoffice (`sync_engine.py` via Pillow) per ridurre il peso delle richieste nella griglia.

---

## content/

Directory per file Markdown destinati alle sezioni del sito (es. **Chi sono**, **Contatti**). Il contenuto viene caricato dinamicamente e renderizzato con `marked.js`.

I file `.md` sono suddivisi in due sottocartelle in base alla lingua:

```
content/
├── it/    # Contenuti in italiano
└── en/    # Contenuti in inglese
```

---

## Note per gli agenti

- **Non modificare `gallery.json` direttamente** in produzione: viene sovrascritto dal sync del backoffice.
- Il sito non usa un bundler; tutto il JS è vanilla o caricato via CDN — non introdurre dipendenze npm senza aggiornare anche il workflow di build.
- I path delle immagini in `gallery.json` sono **assoluti dalla root del sito** (`/img/art/…`): tenerlo in conto se il sito viene servito da un sottopercorso.
- Alpine.js è deferito (`defer`): il DOM è pronto prima che Alpine si inizializzi — non è necessario ascoltare `DOMContentLoaded` manualmente.
