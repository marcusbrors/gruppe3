import type { Match, Player, Standing, Tournament, TournamentFormat } from '../types/tournament'
import { createId } from './ids'

function nextPowerOfTwo(n: number): number {
  let p = 1
  while (p < n) p *= 2
  return p
}

/** Build single-elimination bracket. Byes fill empty slots when player count is not a power of 2. */
export function buildSingleElimination(players: Player[]): Match[] {
  const size = nextPowerOfTwo(Math.max(2, players.length))
  const rounds = Math.log2(size)
  const matches: Match[] = []
  const byRound: Match[][] = []

  for (let r = rounds; r >= 1; r--) {
    const count = 2 ** (r - 1)
    const roundMatches: Match[] = []
    for (let i = 0; i < count; i++) {
      const match: Match = {
        id: createId('m'),
        round: rounds - r + 1,
        index: i,
        player1Id: null,
        player2Id: null,
        winnerId: null,
        status: 'pending',
      }
      roundMatches.push(match)
      matches.push(match)
    }
    byRound.push(roundMatches)
  }

  // Wire advancement: round N match i → round N+1 match floor(i/2)
  for (let r = 0; r < byRound.length - 1; r++) {
    for (let i = 0; i < byRound[r].length; i++) {
      const match = byRound[r][i]
      const next = byRound[r + 1][Math.floor(i / 2)]
      match.nextMatchId = next.id
      match.nextSlot = i % 2 === 0 ? 1 : 2
    }
  }

  // Seed players into first round with byes
  const seeded: (Player | null)[] = [...players]
  while (seeded.length < size) seeded.push(null)

  const firstRound = byRound[0]
  for (let i = 0; i < firstRound.length; i++) {
    const p1 = seeded[i * 2]
    const p2 = seeded[i * 2 + 1]
    const match = firstRound[i]
    match.player1Id = p1?.id ?? null
    match.player2Id = p2?.id ?? null

    if (p1 && !p2) {
      // Bye — auto-advance player1
      match.winnerId = p1.id
      match.status = 'completed'
      advanceWinner(matches, match)
    } else if (!p1 && p2) {
      match.winnerId = p2.id
      match.status = 'completed'
      advanceWinner(matches, match)
    } else if (p1 && p2) {
      match.status = 'ready'
    }
  }

  return matches
}

export function buildRoundRobin(players: Player[]): Match[] {
  const matches: Match[] = []
  let index = 0
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      matches.push({
        id: createId('m'),
        round: 1,
        index: index++,
        player1Id: players[i].id,
        player2Id: players[j].id,
        winnerId: null,
        status: 'ready',
      })
    }
  }
  return matches
}

export function createTournament(
  name: string,
  format: TournamentFormat,
  playerNames: string[],
): Tournament {
  const players: Player[] = playerNames
    .map((n) => n.trim())
    .filter(Boolean)
    .map((name) => ({ id: createId('p'), name }))

  if (players.length < 2) {
    throw new Error('Trenger minst 2 deltakere')
  }

  const matches =
    format === 'single_elimination'
      ? buildSingleElimination(players)
      : buildRoundRobin(players)

  return {
    id: createId('t'),
    name: name.trim() || 'Uten navn',
    format,
    players,
    matches,
    createdAt: new Date().toISOString(),
    status: 'active',
  }
}

function advanceWinner(matches: Match[], completed: Match): void {
  if (!completed.nextMatchId || !completed.winnerId) return
  const next = matches.find((m) => m.id === completed.nextMatchId)
  if (!next) return

  if (completed.nextSlot === 1) next.player1Id = completed.winnerId
  else next.player2Id = completed.winnerId

  if (next.player1Id && next.player2Id && next.status !== 'completed') {
    next.status = 'ready'
  }
}

export function setMatchWinner(tournament: Tournament, matchId: string, winnerId: string): Tournament {
  const matches = tournament.matches.map((m) => ({ ...m }))
  const match = matches.find((m) => m.id === matchId)
  if (!match) return tournament
  if (match.status === 'completed' && match.winnerId === winnerId) return tournament

  // Clear previous advancement if changing winner
  if (match.winnerId && match.nextMatchId) {
    const next = matches.find((m) => m.id === match.nextMatchId)
    if (next && next.status !== 'completed') {
      if (match.nextSlot === 1 && next.player1Id === match.winnerId) {
        next.player1Id = null
        next.status = 'pending'
      }
      if (match.nextSlot === 2 && next.player2Id === match.winnerId) {
        next.player2Id = null
        next.status = 'pending'
      }
    }
  }

  if (winnerId !== match.player1Id && winnerId !== match.player2Id) {
    return tournament
  }

  match.winnerId = winnerId
  match.status = 'completed'
  advanceWinner(matches, match)

  const allDone = matches.every((m) => m.status === 'completed')
  return {
    ...tournament,
    matches,
    status: allDone ? 'completed' : 'active',
  }
}

export function getStandings(tournament: Tournament): Standing[] {
  const map = new Map<string, Standing>()
  for (const p of tournament.players) {
    map.set(p.id, { playerId: p.id, played: 0, wins: 0, losses: 0, points: 0 })
  }

  for (const m of tournament.matches) {
    if (m.status !== 'completed' || !m.winnerId || !m.player1Id || !m.player2Id) continue
    const loserId = m.winnerId === m.player1Id ? m.player2Id : m.player1Id
    const winner = map.get(m.winnerId)
    const loser = map.get(loserId)
    if (!winner || !loser) continue
    winner.played++
    winner.wins++
    winner.points += 3
    loser.played++
    loser.losses++
  }

  return [...map.values()].sort((a, b) => b.points - a.points || b.wins - a.wins)
}

export function getPlayerName(tournament: Tournament, playerId: string | null): string {
  if (!playerId) return 'TBD'
  return tournament.players.find((p) => p.id === playerId)?.name ?? 'Ukjent'
}

export function getRounds(matches: Match[]): number[] {
  return [...new Set(matches.map((m) => m.round))].sort((a, b) => a - b)
}

export function roundLabel(format: TournamentFormat, round: number, totalRounds: number): string {
  if (format === 'round_robin') return 'Kamper'
  if (round === totalRounds) return 'Finale'
  if (round === totalRounds - 1) return 'Semifinale'
  if (round === totalRounds - 2) return 'Kvartfinale'
  return `Runde ${round}`
}

export function progressPercent(tournament: Tournament): number {
  const playable = tournament.matches.filter(
    (m) => m.player1Id && m.player2Id,
  )
  if (playable.length === 0) return 0
  const done = playable.filter((m) => m.status === 'completed').length
  return Math.round((done / playable.length) * 100)
}
