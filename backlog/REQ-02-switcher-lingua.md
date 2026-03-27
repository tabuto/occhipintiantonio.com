# REQ-02 — Switcher di lingua IT / EN

## Contesto

Il sito è pensato per utenti italiani e internazionali. I file `.md` sono già in `content/it/`; la cartella `content/en/` è ancora da creare.

## Obiettivo

Aggiungere un toggle IT | EN nel header e gestire la lingua corrente tramite Alpine.js store globale con persistenza in `localStorage`.

## Requisiti

- [ ] Aggiungere toggle lingua **IT | EN** nel header, visivamente coerente con la palette (`powder` / `ink`)
- [ ] Creare Alpine.js store globale: `Alpine.store('i18n', { lang: 'it' })`
- [ ] Al cambio lingua, ricaricare tutti i blocchi Markdown: about, contatti, mostre, articoli
- [ ] Persistere la preferenza in `localStorage` con chiave `lang`
- [ ] Al caricamento della pagina leggere `localStorage`; se presente, usare il valore salvato; default: `it`
- [ ] Creare la struttura `content/en/` con i file speculari:
  - `content/en/about.md`
  - `content/en/contatti.md`
  - `content/en/mostre.md`
  - `content/en/articoli.md`

## Criteri di accettazione

- Il toggle IT | EN è visibile nel header su tutti i breakpoint
- Cliccando EN, tutti i testi Markdown passano all'inglese senza ricaricare la pagina
- Ricaricare la pagina dopo aver scelto EN mantiene la lingua inglese
- La lingua default è `it` se `localStorage` è vuoto

## File coinvolti

- `index.html`
- `content/en/about.md` (da creare)
- `content/en/contatti.md` (da creare)
- `content/en/mostre.md` (da creare)
- `content/en/articoli.md` (da creare)

## Dipendenze

- REQ-01 deve usare il valore della lingua da questo store

## Note

- Il toggle può essere realizzato con due bottoni `<button>` con `@click="$store.i18n.lang = 'it'"` e `$store.i18n.lang = 'en'`
- Applicare stile `font-bold` al bottone della lingua attiva
