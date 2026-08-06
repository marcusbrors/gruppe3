# Kjell Games — Turneringer (Gruppe 3)

Enkel webapp for å opprette turneringer og oppdatere fremdrift. Bygget for demo/MVP.

## Stack

- React + TypeScript (Vite)
- Tailwind CSS v4
- React Router
- localStorage (ingen backend)

## Kom i gang

```bash
npm install
npm run dev
```

Åpne [http://localhost:5173](http://localhost:5173).

## Demo-flyt (MVP)

1. **Oversikt** — se lagrede turneringer og fremdrift
2. **Ny turnering** — velg oppsett:
   - Cup (single elimination)
   - Serie (alle mot alle / round robin)
3. **Turneringsside** — klikk på vinner i hver kamp for å oppdatere fremdrift
   - Cup: vinnere rykkes videre i bracket
   - Serie: tabell oppdateres med poeng

## Prosjektstruktur

```
src/
  components/   # Layout, MatchCard, BracketView, StandingsTable
  context/      # TournamentProvider (state + localStorage)
  data/         # localStorage helpers
  lib/          # Bracket/serie-logikk
  pages/        # Home, Create, Detail
  types/        # TypeScript-typer
```

## Videre (hvis tid)

- Double elimination
- Rediger deltakere etter start
- Score (ikke bare vinner)
- Delbar lenke / backend
