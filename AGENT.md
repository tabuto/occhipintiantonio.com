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
- **`security`** (choice, default `strict`) — verifica del certificato TLS. Il default dell'action, se non si passa nulla, e' `loose`: cifrato ma **non** autenticato. Vedi la sezione *TLS: cifrato non vuol dire verificato*.
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

### ✅ Risolto — perché la "prima pubblicazione" fallisce sempre

**Causa accertata il 19 novembre 2026** diagnosticandola sul repository gemello
`francescodidio.com`, che gira sullo stesso provider con la stessa action e ha prodotto uno
stack trace identico frame per frame.

Il colpevole **non è la creazione delle cartelle**. È il `RETR` del manifest assente. La sequenza
reale:

1. l'action apre l'`EPSV` **prima** di mandare il `RETR`, quindi il socket dati è già aperto;
2. il file non esiste, il server risponde `550` e resetta quel socket dati;
3. basic-ftp considera fatale qualunque errore sul socket dati e **chiude l'intero client**;
4. l'eccezione salta fuori sul primo comando di controllo successivo, che è `ensureDir` →
   `creating folder "content/"`. La cartella è una vittima, non la causa.

Lo si vede nello stack trace dei run falliti (`Client.ensureDir` → `Client._openDir` →
`Client.sendIgnoringError`) e nel fatto che il messaggio arriva **dopo** la riga
`No file exists on the server "./.ftp-deploy-sync-state.json"`.

È una **corsa**, non un guasto deterministico: a volte il `550` arriva pulito e il run prosegue.
Questo spiega l'unico successo della tabella storica (prima pubblicazione in `_deploytest/` in
`ftp`) senza bisogno di invocare il protocollo: su `francescodidio.com` il 19 novembre la stessa
corsa è stata persa 4 volte su 5, in `ftps` **e in `ftp` in chiaro**.

**Procedura per pubblicare in una directory senza manifest** (è il rimedio che qui era già stato
trovato per tentativi, ora con la spiegazione giusta): caricare a mano il manifest nella root di
destinazione, col nome esatto `.ftp-deploy-sync-state.json` — col punto iniziale. Un seed minimo
basta:

```json
{"description": "DO NOT DELETE THIS FILE...", "version": "1.0.0", "generatedTime": 1795021221078, "data": []}
```

Con `data: []` l'action considera il server vuoto, ripubblica tutto e a fine sync riscrive da sé
il manifest veritiero. Su `francescodidio.com` questo ha trasformato 4 fallimenti su 5 in una
pubblicazione completa: 32 voci in 17,3 secondi, 28 file su 28 verificati identici via sha256.

**Attenzione al nome.** Su `francescodidio.com` il seed era stato caricato come
`.ftp-deploy-seed-state.json` — *seed* invece di *sync* — e ogni `RETR` riceveva un `550`
legittimo. Il messaggio `No file exists on the server` **non distingue** fra file assente e
canale dati rotto, perché l'action inghiotte l'errore vero in un `catch`. Per sapere quale dei
due, interroga il server con `SIZE` o `MLSD`, che viaggiano sul canale di controllo.

#### Ipotesi da non riesumare

Scartate con prove alla mano, sui due siti insieme:

- **ban IP o Fail2Ban**: il login riesce in ~2 s anche nei run falliti.
- **un firewall o un ALG FTP che gatekeepa le porte passive**: dal runner GitHub i trasferimenti
  cifrati passano.
- **i file da 0 byte**: pubblicati senza problemi sul canale cifrato.
- **una protezione anti-flood scattata dopo un picco di connessioni**: dedotta da una
  coincidenza temporale su `francescodidio.com` e smentita — era il nome del file sbagliato.

### TLS: cifrato non vuol dire verificato

Il deploy usa `protocol: ftps` (TLS esplicito sulla 21) e funziona, ma l'input `security`
dell'action vale **`loose`** per default, cioè `rejectUnauthorized: false`: il certificato del
server non viene verificato. Il traffico è cifrato e **non** autenticato, quindi un
intercettatore sulla rete può presentare un certificato qualunque, terminare il TLS e leggere la
password FTP in chiaro.

Il certificato di questo hosting è emesso da Let's Encrypt per **`web.marte.vhosting-it.com`**
(`185.116.60.13`, lo stesso indirizzo del sito) e quel nome è l'unico SAN presente: non
`occhipintiantonio.com`, non l'IP. Per passare a `security: strict` servono quindi due cose
insieme:

1. il secret `FTP_SERVER` impostato a `web.marte.vhosting-it.com`;
2. il fallback di `security` nel workflow portato da `loose` a `strict`.

Cambiarne una sola rompe il deploy: con l'IP o col nome del sito nessun certificato può validare.

**Fatto il 20 novembre 2026.** Entrambe le modifiche sono in esercizio e verificate dal run
`44780177941`: `230 User logged in` con verifica del certificato superata, canale di controllo in
`TLSv1.2`, e il manifest riscritto con `Uploading to 185.116.60.13:56096 (TLSv1.3)`, cioè una
`STOR` sul canale dati cifrato **e** autenticato. 98 voci in pari, 88 file `doing nothing`, zero
upload di contenuto, 489 ms.

Nota diagnostica utile: il canale dati negozia `TLSv1.3` mentre il controllo è in `TLSv1.2`,
quindi la sessione **non** viene ripresa — e il trasferimento riesce comunque. È la conferma
diretta che questo server accetta connessioni dati con sessione TLS nuova, al contrario di
`web.ariel.vhosting-it.com`.

Attenzione a un falso indizio incontrato per strada: il primo tentativo con `strict` è fallito
con `530 Login incorrect`, e la tentazione è attribuirlo a `strict`. Non era così — un run
identico con `loose` dava lo stesso `530`. La password nel secret era stata riscritta il 16
novembre alle 20:13:13Z, sei minuti **dopo** l'ultimo deploy riuscito (20:06:40Z), quindi quel
valore non era mai stato usato e non corrispondeva all'account. Il `530` arriva dopo il `331` e
dopo un handshake TLS andato a buon fine: è autenticazione, non TLS.

Nota sul server gemello: su `francescodidio.com` (`web.ariel.vhosting-it.com`) `security: loose`
**impediva del tutto** i trasferimenti cifrati, perché l'action gira su Node 24 e il fix di
CVE-2026-48934 vincola il riuso della sessione TLS a un host autenticato, che senza verifica non
c'è; quel ProFTPD scarta la connessione dati non ripresa. Qui `loose` funziona, quindi questo
server accetta sessioni dati non riprese: è una differenza di configurazione fra i due server,
non una differenza di versione della libreria.

---

## Note per gli agenti

- **Non modificare `gallery.json` direttamente** in produzione: viene sovrascritto dal sync del backoffice.
- Il sito non usa un bundler; tutto il JS è vanilla o caricato via CDN — non introdurre dipendenze npm senza aggiornare anche il workflow di build.
- I path delle immagini in `gallery.json` sono **assoluti dalla root del sito** (`/img/art/…`): tenerlo in conto se il sito viene servito da un sottopercorso.
- **Il deploy su `master` è automatico**: ogni push pubblica i file modificati sul sito reale. Per committare senza pubblicare, includere `[skip ci]` nel messaggio.
- **Prima di aggiungere una cartella nuova al repo**, leggere il punto aperto nella sezione *Deploy*: la creazione di cartelle nella root non è un'operazione verificata.
- Non cancellare né modificare a mano `.ftp-deploy-sync-state.json` sul server: è il manifest che rende il deploy incrementale.
- Alpine.js è deferito (`defer`): il DOM è pronto prima che Alpine si inizializzi — non è necessario ascoltare `DOMContentLoaded` manualmente.
