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

På Windows PowerShell: bruk `npm.cmd install` / `npm.cmd run dev` hvis scripts er blokkert.

## Turneringsoppsett

| Oppsett | Beskrivelse |
|---------|-------------|
| **Cup** | Utslagsturnering (single elimination) med bracket |
| **Liga** | Dobbel serie — alle møter alle to ganger, med tabell |
| **Alle mot alle** | Enkel serie — alle møter alle én gang |
| **Swiss stage** | Flere runder; spillere med lik score møtes. Neste runde genereres automatisk |

## Demo-flyt

1. **Oversikt** — se lagrede turneringer og fremdrift
2. **Ny turnering** — velg ett av de fire oppsettene
3. **Turneringsside** — klikk på vinner i hver kamp

## Prosjektstruktur

```
src/
  components/   # Layout, MatchCard, BracketView, RoundsView, StandingsTable
  context/      # TournamentProvider (state + localStorage)
  data/         # localStorage helpers
  lib/          # Cup / liga / swiss / round-robin-logikk
  pages/        # Home, Create, Detail
  types/        # TypeScript-typer
```
