# AGENT.md — Documentazione tecnica del sito

> **Protocollo operativo:** prima di ogni operazione leggi questo file. Dopo ogni modifica aggiorna `llms.txt`, `sitemap.xml` e questo file se necessario. Le istruzioni complete sono in `CLAUDE.md`.

Sito statico del portfolio di Antonio Occhipinti. Non richiede runtime server-side: viene servito da un web server (hosting Plesk, document root `httpdocs`) e pubblicato in modo incrementale via FTP da GitHub Actions — vedi *Deploy*.

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
  powder:  '#C44027',   // accento rosso terracotta (tab attivi, link, separatori)
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

## Cache-busting dei contenuti Markdown

Ogni scheda HTML carica il proprio `.md` tramite `fetch` con un query parameter `?v=CONTENT_VERSION`. La costante è definita in fondo a ciascun file HTML:

```js
const CONTENT_VERSION = 'YYYYMMDD'
```

**Regola:** ogni volta che si modifica un file `content/*/docs/[slug].md`, aggiornare la `CONTENT_VERSION` nel corrispondente `it/docs/[slug].html` con la data del giorno (`YYYYMMDD`). Senza questo aggiornamento il browser potrebbe mostrare il vecchio contenuto dalla cache.

---

## Deploy — GitHub Actions via FTP

Il sito viene pubblicato dal workflow `.github/workflows/deploy-ftp.yml` (nome: *Deploy FTP*), che carica via FTPS **solo i file modificati** usando `SamKirkland/FTP-Deploy-Action@v4.3.5`.

### Trigger

| Trigger | Comportamento |
|---|---|
| `push` su `master` | deploy reale su `./`, protocollo `ftps`, log `standard` |
| `workflow_dispatch` | avvio manuale dalla tab *Actions*, con gli input qui sotto |

Input del run manuale:

- **`dry_run`** (boolean, default `true`) — simula senza caricare nulla. Un run in dry run dura pochi secondi: se un run "riuscito" è durato 2-3 secondi, non ha pubblicato niente.
- **`server_dir`** (string, default `_deploytest/`) — cartella remota di destinazione, deve finire con `/`. `./` pubblica sul sito reale.
- **`protocol`** (choice, default `ftps`) — `ftp` invia **la password in chiaro**: usarlo solo come diagnostica e cambiare la password dopo.
- **`log_level`** (choice, default `standard`) — `verbose` stampa il dialogo FTP comando per comando, indispensabile per diagnosticare i fallimenti.

Gli input valgono solo per il run manuale: nel workflow ogni valore è protetto da `github.event_name == 'workflow_dispatch' && inputs.x || '<default>'`, così un push usa sempre i default di produzione.

Per committare senza innescare un deploy, includere **`[skip ci]`** nel messaggio di commit.

### Credenziali e percorsi

- Secret del repository (Settings → Secrets and variables → Actions): `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. Nei log appaiono come `***`; non sono disponibili in locale.
- `server-dir: ./` corrisponde alla **root di login dell'utente FTP, che è `httpdocs`** (la document root del sito). Non serve prefissare `httpdocs/`.
- `local-dir: ./` è la root del repo. Sono esclusi dal deploy: `**/.git*`, `.github/**`, `.claude/**`, `backlog/**`, `CLAUDE.md`, `AGENT.md`, `SPECS.md`, `server.py`, `server_start.sh`, `server_stop.sh`. Anche `img/` e `bucket/` non vengono mai pubblicati perché sono in `.gitignore` (le immagini stanno su Cloudinary).
- `concurrency: ftp-deploy` con `cancel-in-progress: false`: due deploy non si sovrappongono mai.

### Il file di stato `.ftp-deploy-sync-state.json`

È il cuore del meccanismo incrementale. L'action **non elenca mai la cartella remota**: scarica questo manifest dalla root di destinazione, lo confronta con i file locali e carica solo le differenze.

- Contiene una voce per cartella (`{"type":"folder","name":…}`) e una per file, con `size` e **`hash` = sha256 del contenuto**.
- Viene riscritto **solo al termine di un sync riuscito**. Se un run muore a metà, lo stato resta quello precedente e il run successivo ricalcola lo stesso diff: l'operazione è idempotente.
- Se manca, l'action entra in modalità "prima pubblicazione" e tenta di caricare *tutti* i file creando *tutte* le cartelle — vedi il punto aperto sotto.
- È servito via HTTP come qualunque altro file della root: non contiene credenziali, ma espone l'elenco dei file con dimensioni e hash. Conviene negarne l'accesso via `.htaccess` (il deploy continua a funzionare perché l'action lo legge via FTP).

### ⚠️ Punto aperto — prima pubblicazione e creazione di nuove cartelle

**Stato: non risolto.** Sull'hosting (Plesk + ProFTPD) la modalità "prima pubblicazione" sulla root del sito **ha sempre fallito**, con `Error: Client is closed because read ECONNRESET (data socket)` al primo `creating folder "…"`. Evidenza raccolta il 15-16 novembre 2026:

| Scenario | Esito |
|---|---|
| Sync incrementale con file di stato presente (`ftps` e `ftp`) | ✅ sempre riuscito |
| Prima pubblicazione in `_deploytest/` (cartelle inesistenti), `ftp` | ✅ unico caso riuscito, 98 file in ~50 s |
| Prima pubblicazione in `_deploytest/`, `ftps` | ❌ |
| Prima pubblicazione nella root `./` (cartelle già esistenti), `ftps` e `ftp` | ❌ 4 tentativi su 4 |

Il canale di controllo è sano in tutti i casi (`220 ProFTPD`, `230 User logged in`, `MKD .` → `257`, `CWD .` → `250`, `EPSV` → `229`): muore solo il canale dati. Le ipotesi scartate con prove alla mano: non è un ban IP o un Fail2Ban (il login riesce in ~2 s anche nei run falliti), non è il riuso della sessione TLS (fallisce anche in `ftp` in chiaro), non è la directory di destinazione sbagliata (`./` è `httpdocs`).

**Conseguenza pratica:** aggiungere una **cartella nuova** al repo e fare push non è un'operazione provata. La creazione di cartelle di per sé funziona (l'ha fatto la pubblicazione completa in `_deploytest/`), ma nella root non è mai stata verificata.

Procedura consigliata la prima volta che si aggiunge una cartella:

1. commit e push con `[skip ci]`;
2. run manuale con `dry_run` spuntato e `server_dir: ./`, controllando che il diff mostri la riga `📁 Creating folder: …`;
3. run vero con `log_level: verbose`, così in caso di errore si ha il dialogo FTP completo.

Se fallisce: creare la cartella a mano da Plesk e rilanciare. Una cartella preesistente non è un ostacolo — la libreria sottostante ignora l'errore del `MKD` ed entra con `CWD`, come avviene a ogni run incrementale che scrive in `it/docs/` o `content/it/`.

**Rimedio noto se il file di stato va perso** (ha sbloccato la pubblicazione del 16 novembre 2026): invece di affidarsi alla "prima pubblicazione", si ricostruisce un file di stato veritiero e lo si carica a mano nella root. Il sito è statico e pubblico, quindi si può scaricare via HTTP ogni file elencato nel manifest, confrontarne lo sha256 con quello locale e generare un `.ftp-deploy-sync-state.json` che contenga **tutte le cartelle** e **solo i file già allineati**, omettendo quelli da pubblicare. Al run successivo l'action vede le cartelle come esistenti (nessun `MKD`), carica esattamente i file omessi e a fine sync riscrive da sé lo stato corretto.

---

## Note per gli agenti

- **Non modificare `gallery.json` direttamente** in produzione: viene sovrascritto dal sync del backoffice.
- Il sito non usa un bundler; tutto il JS è vanilla o caricato via CDN — non introdurre dipendenze npm senza aggiornare anche il workflow di build.
- I path delle immagini in `gallery.json` sono **assoluti dalla root del sito** (`/img/art/…`): tenerlo in conto se il sito viene servito da un sottopercorso.
- **Il deploy su `master` è automatico**: ogni push pubblica i file modificati sul sito reale. Per committare senza pubblicare, includere `[skip ci]` nel messaggio.
- **Prima di aggiungere una cartella nuova al repo**, leggere il punto aperto nella sezione *Deploy*: la creazione di cartelle nella root non è un'operazione verificata.
- Non cancellare né modificare a mano `.ftp-deploy-sync-state.json` sul server: è il manifest che rende il deploy incrementale.
- Alpine.js è deferito (`defer`): il DOM è pronto prima che Alpine si inizializzi — non è necessario ascoltare `DOMContentLoaded` manualmente.
