# REQ-14 — Riorganizzazione Mostre: Internazionali e Nazionali

## Contesto

La pagina `mostre.html` elenca tutte le esposizioni in un'unica lista cronologica. Molte mostre hanno carattere internazionale (tenute all'estero, premi internazionali, rassegne multi-paese) e meritano una sezione distinta per valorizzare la dimensione internazionale della carriera di Antonio Occhipinti.

## Obiettivo

Suddividere la cronologia delle mostre in due sezioni:
1. **Mostre Internazionali** — in cima alla pagina
2. **Mostre Nazionali** — nella sezione inferiore

Entrambe le sezioni devono essere ordinate cronologicamente per anno.

## Criteri di classificazione "Internazionale"

Una mostra è classificata come **internazionale** se rientra in almeno uno dei seguenti criteri:

- **Tenuta all'estero** (fuori dal territorio italiano, inclusa la Città del Vaticano)
- **Premio Internazionale** con classificazione esplicita (1° posto) e titolo "Internazionale"
- **Rassegna multi-paese** con partecipazione documentata di artisti/istituzioni di almeno due nazioni estere
- **Collaborazione istituzionale** tra associazioni di paesi diversi (es. AIA + Sociedad Mexicana)

## Mostre proposte come Internazionali

| Anno | Mostra | Motivazione |
|------|--------|-------------|
| 1978 | Mostra collettiva "34 Vence", **Cannes (Francia)** | Tenuta all'estero |
| 1986 | **Premio Internazionale "Fabriano"** *(1° classificato)*, Fabriano | Premio internazionale, 1° posto |
| 1986 | **Premio Internazionale "La Sciara di Stromboli"** *(1° classificato)*, Eolie | Premio internazionale, 1° posto |
| 1989 | Esposizione Galerie Jacqueline Nioncel, **Parigi (Francia)** | Tenuta all'estero |
| 1989 | Premio Internazionale di Acquerello "La Sciara di Stromboli", Eolie | Premio internazionale |
| 1994 | Premio Internazionale Roma Fiat Acquerello, Roma | Premio internazionale |
| 1995 | Rassegna Internazionale dell'Acquerello (Irlanda–Italia–Ungheria), Cremona | Multi-paese (3 nazioni) |
| 1995 | Premio Internazionale dell'Acquerello "Roma Fiat", Roma | Premio internazionale |
| 1995 | Museo Nacional de la Acuarela, **Città del Messico (Messico)** | Tenuta all'estero |
| 1996 | Rassegna Internazionale dell'Acquerello, Belluno | Rassegna internazionale |
| 1998 | "Arte antiguo... Arte nuevo", Museo Nacional de la Acuarela, Arona (NO) | Collaborazione AIA–Sociedad Mexicana |
| 1998 | **Consegna ritratto a S.S. Giovanni Paolo II**, **Città del Vaticano** | Tenuta all'estero (Santa Sede) |
| 1998 | Biennale dell'Acquerello, Sala Cultural Caja Madrid, **Barcellona (Spagna)** | Tenuta all'estero |
| 1999 | Collettiva Acquerellisti Italiani e Stranieri, **Belgio** | Tenuta all'estero |
| 1999 | 21ª Salone Internazionale dell'Acquerello, Aquarel Instituut van België, **Belgio** | Tenuta all'estero |
| 2000 | Rassegna Internazionale dell'Acquerello, Cannobio Verbano | Rassegna internazionale |
| 2000 | **IV Biennale Internazionale dell'Acquerello**, Museo Nacional de la Acuarela, **Città del Messico (Messico)** | Tenuta all'estero, Biennale internazionale |
| 2001 | Acquerello Senza Confini (Texas–Italia), Southwestern Watercolor Society | Collaborazione Italia–USA |
| 2001 | Acquerello Senza Confini (Italia–Texas), A.I.A. | Collaborazione Italia–USA |
| 2001 | **"Ai Confini dell'Europa"**, International Association of Watercolors, **Irlanda** | Tenuta all'estero, multi-paese |
| 2002 | Museo de la Acuarela di Llançà, **Spagna** | Tenuta all'estero |
| 2003 | "Colori sull'Acqua" — con Italia, Catalunya, Belgio, Danimarca, Finlandia, Islanda, Norvegia, Svezia. Maccagno | Multi-paese (8 nazioni) |
| 2004 | "Trent'anni per l'Acquerello" — con Italia, Austria, Belgio, Brasile, Colombia, Irlanda, Messico, Danimarca, Finlandia, Islanda, Norvegia, Svezia, Russia, Spagna. Arezzo | Multi-paese (14 nazioni) |
| 2005 | Mostra Internazionale dell'Acquerello, **Anversa (Belgio)** | Tenuta all'estero |
| 2006 | Mostra Internazionale dell'Acquerello, Milano | Mostra internazionale |
| 2006 | Mostra Internazionale dell'Acquerello, **Bilbao (Spagna)** | Tenuta all'estero |
| 2006 | Mostra Internazionale "Note d'Acquerello", Cremona | Mostra internazionale |
| 2006 | Biennale Internazionale dell'Acquerello Italia–Spagna, Cremona | Biennale internazionale |
| 2007 | Rassegna Internazionale dell'Acquerello, Vicenza | Rassegna internazionale |
| 2008 | Mostra Internazionale Biennale "Note d'Acquerello", Cremona | Mostra internazionale |
| 2009 | Festival Internazionale dell'Acquerello, Bellagio (CO) | Festival internazionale |
| 2009 | Collettiva Internazionale d'Arte, Galleria L'Androne, Scicli (RG) | Collettiva internazionale |

## Requisiti

- [ ] Riorganizzare `content/it/mostre.md` con sezione `# Mostre Internazionali` in testa e `# Mostre Nazionali` a seguire, entrambe ordinate cronologicamente per anno.
- [ ] Applicare la stessa struttura a `content/en/mostre.md`.
- [ ] In `css/styles.css` aggiungere stile per `#mostre-content h1` che identifichi visivamente i titoli di sezione (serif, colore `ink`, bordo inferiore `powder`).
- [ ] Aggiornare `CONTENT_VERSION` in `mostre.html` per invalidare la cache.
- [ ] Aggiornare il meta `description` di `mostre.html` per riflettere la nuova struttura.

## Criteri di accettazione

- Le due sezioni sono visivamente distinte con intestazione serif e bordo inferiore nella palette del sito.
- Le intestazioni anno (`## ANNO`) restano in `powder` come prima.
- Gli anni che contengono sia mostre nazionali che internazionali appaiono in entrambe le sezioni.
- Il cambio lingua IT/EN aggiorna correttamente entrambe le sezioni.
- La pagina è responsive su mobile/tablet/desktop.

## File coinvolti

- `content/it/mostre.md`
- `content/en/mostre.md`
- `css/styles.css`
- `mostre.html`

## Dipendenze

- REQ-03 (sezione mostre già implementata)
