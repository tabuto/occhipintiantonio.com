# CLAUDE.md — Protocollo operativo

Questo file viene letto automaticamente da Claude Code all'avvio di ogni sessione.

---

## Prima di qualsiasi operazione

1. **Leggi `AGENT.md`** — struttura del sito, convenzioni tecniche, pattern già stabiliti.
2. **Leggi `SPECS.md`** se stai lavorando su nuove funzionalità o modifiche architetturali.

---

## Dopo ogni modifica o aggiunta di contenuto

Aggiorna **sempre** i tre file seguenti a fine operazione:

### 1. `llms.txt`
Aggiungi una voce nella sezione appropriata per ogni nuova pagina o scheda.
Formato: `- [Titolo](URL): Descrizione breve.`

### 2. `sitemap.xml`
Aggiungi un blocco `<url>` per ogni nuova pagina HTML sotto la sezione di categoria corretta.
Schede documenti: `<priority>0.6</priority>`, `<changefreq>yearly</changefreq>`.

### 3. `AGENT.md`
Aggiorna solo se hai introdotto:
- un nuovo pattern tecnico o strutturale (es. nuovo tipo di scheda, nuovo componente Alpine)
- una nuova convenzione di naming o di organizzazione dei file
- una modifica architetturale significativa

---

## Pattern: aggiunta di una scheda documento

Ogni scheda richiede **cinque interventi**:

| File | Operazione |
|---|---|
| `it/docs/[slug].html` | Crea pagina HTML con `schadaPage('[slug]')` (copia da un file esistente, cambia slug e meta) |
| `content/it/docs/[slug].md` | Crea contenuto IT con frontmatter (`title`, `tipologia`, `slug`, `date`, `image`, `excerpt`) |
| `content/en/docs/[slug].md` | Crea contenuto EN speculare |
| `data/documenti-index.json` | Aggiungi voce JSON in fondo all'array |
| `content/it/documenti.md` + `content/en/documenti.md` | Aggiungi voce riassuntiva nella sezione corretta |

Poi aggiorna `llms.txt` e `sitemap.xml` come indicato sopra.

---

## Palette colori attuale

```js
canvas:  '#FCFCFC'   // sfondo
ink:     '#1A1A1A'   // testo
powder:  '#C44027'   // accento (rosso terracotta)
```
