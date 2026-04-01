# REQ-05 — Correzione email di contatto

## Contesto

La sezione contatti in `index.html` contiene l'email placeholder `giulia@example.com`. L'email corretta è `occhipinti.antonio.fam@gmail.com` (già presente in `content/it/contatti.md`).

## Obiettivo

Sostituire l'email placeholder con quella reale in tutti i punti dell'HTML statico.

## Requisiti

- [ ] Cercare ogni occorrenza di `giulia@example.com` in `index.html`
- [ ] Sostituire `mailto:giulia@example.com` con `mailto:occhipinti.antonio.fam@gmail.com`
- [ ] Aggiornare il testo visibile del link da `giulia@example.com` a `occhipinti.antonio.fam@gmail.com`
- [ ] Verificare che `content/it/contatti.md` riporti già la stessa email (è così — nessuna modifica necessaria)

## Criteri di accettazione

- Nessuna occorrenza di `giulia@example.com` rimane nel codice
- Il link email nella sezione Contatti apre il client di posta con destinatario `occhipinti.antonio.fam@gmail.com`
- Il testo visibile del link mostra `occhipinti.antonio.fam@gmail.com`

## File coinvolti

- `index.html`

## Dipendenze

Nessuna — task autonomo e indipendente.

## Note

- Task di piccola entità; può essere eseguito in pochi minuti
- Verificare che l'email non compaia anche in altri file (js/, css/) tramite una ricerca globale
