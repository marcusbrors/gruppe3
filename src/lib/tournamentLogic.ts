import type { Match, Player, Standing, Tournament, TournamentFormat } from '../types/tournament'
import { createId } from './ids'
import { placeSeedsInBracket, sortBySeed } from './seeding'

function nextPowerOfTwo(n: number): number {
  let p = 1
  while (p < n) p *= 2
  return p
}

function swissRoundCount(playerCount: number): number {
  // Typical swiss: enough rounds to separate the field
  return Math.max(3, Math.ceil(Math.log2(Math.max(2, playerCount))))
}

/** Cup: single-elimination bracket with standard seeding and byes when needed. */
export function buildCup(players: Player[]): Match[] {
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

  for (let r = 0; r < byRound.length - 1; r++) {
    for (let i = 0; i < byRound[r].length; i++) {
      const match = byRound[r][i]
      const next = byRound[r + 1][Math.floor(i / 2)]
      match.nextMatchId = next.id
      match.nextSlot = i % 2 === 0 ? 1 : 2
    }
  }

  // Seed 1 vs seed N, seed 2 vs N-1, … so top seeds meet late
  const seeded = placeSeedsInBracket(sortBySeed(players), size)

  const firstRound = byRound[0]
  for (let i = 0; i < firstRound.length; i++) {
    const p1 = seeded[i * 2]
    const p2 = seeded[i * 2 + 1]
    const match = firstRound[i]
    match.player1Id = p1?.id ?? null
    match.player2Id = p2?.id ?? null

    if (p1 && !p2) {
      match.winnerId = p1.id
      match.status = 'completed'
      match.isBye = true
      advanceWinner(matches, match)
    } else if (!p1 && p2) {
      match.winnerId = p2.id
      match.status = 'completed'
      match.isBye = true
      advanceWinner(matches, match)
    } else if (p1 && p2) {
      match.status = 'ready'
    }
  }

  return matches
}

/** Alle mot alle: single round robin (flat list), ordered by seed. */
export function buildRoundRobin(players: Player[]): Match[] {
  const ordered = sortBySeed(players)
  const matches: Match[] = []
  let index = 0
  for (let i = 0; i < ordered.length; i++) {
    for (let j = i + 1; j < ordered.length; j++) {
      matches.push({
        id: createId('m'),
        round: 1,
        index: index++,
        player1Id: ordered[i].id,
        player2Id: ordered[j].id,
        winnerId: null,
        status: 'ready',
      })
    }
  }
  return matches
}

/**
 * Liga: double round robin scheduled into rounds (circle method).
 * Each pair plays twice (hjemme/borte). Seed order affects schedule.
 */
export function buildLeague(players: Player[]): Match[] {
  const firstLeg = buildCircleRounds(sortBySeed(players))
  const secondLeg = firstLeg.map((m) => ({
    ...m,
    id: createId('m'),
    round: m.round + (firstLeg.length ? Math.max(...firstLeg.map((x) => x.round)) : 0),
    player1Id: m.player2Id,
    player2Id: m.player1Id,
    winnerId: null,
    status: 'ready' as const,
  }))

  // Re-index
  return [...firstLeg, ...secondLeg].map((m, index) => ({ ...m, index }))
}

/** Circle method for single round robin with proper rounds. */
function buildCircleRounds(players: Player[]): Match[] {
  const ids = players.map((p) => p.id)
  const odd = ids.length % 2 === 1
  const list = odd ? [...ids, null] : [...ids]
  const n = list.length
  const rounds = n - 1
  const half = n / 2
  const matches: Match[] = []
  let index = 0

  // Rotate all but first element
  const arr = [...list]
  for (let round = 1; round <= rounds; round++) {
    for (let i = 0; i < half; i++) {
      const a = arr[i]
      const b = arr[n - 1 - i]
      if (a && b) {
        matches.push({
          id: createId('m'),
          round,
          index: index++,
          player1Id: a,
          player2Id: b,
          winnerId: null,
          status: 'ready',
        })
      }
    }
    // rotate: keep index 0 fixed
    const fixed = arr[0]
    const rest = arr.slice(1)
    rest.unshift(rest.pop()!)
    arr.splice(0, arr.length, fixed, ...rest)
  }

  return matches
}

function getWinsMap(players: Player[], matches: Match[]): Map<string, number> {
  const wins = new Map(players.map((p) => [p.id, 0]))
  for (const m of matches) {
    if (m.status === 'completed' && m.winnerId) {
      wins.set(m.winnerId, (wins.get(m.winnerId) ?? 0) + 1)
    }
  }
  return wins
}

function havePlayed(matches: Match[], a: string, b: string): boolean {
  return matches.some(
    (m) =>
      (m.player1Id === a && m.player2Id === b) ||
      (m.player1Id === b && m.player2Id === a),
  )
}

function playersWithBye(matches: Match[]): Set<string> {
  const set = new Set<string>()
  for (const m of matches) {
    if (!m.isBye || !m.winnerId) continue
    set.add(m.winnerId)
  }
  return set
}

/** Pair players for one swiss round. */
export function buildSwissRound(
  players: Player[],
  existingMatches: Match[],
  round: number,
): Match[] {
  const wins = getWinsMap(players, existingMatches)
  const hadBye = playersWithBye(existingMatches)

  // Higher score first; seed as tiebreaker (seed 1 before seed 2)
  const ordered = [...players].sort((a, b) => {
    const dw = (wins.get(b.id) ?? 0) - (wins.get(a.id) ?? 0)
    if (dw !== 0) return dw
    return a.seed - b.seed || a.name.localeCompare(b.name, 'no')
  })

  // Give bye to lowest-ranked player who hasn't had one (if odd)
  let byePlayer: Player | null = null
  const pool = [...ordered]
  if (pool.length % 2 === 1) {
    for (let i = pool.length - 1; i >= 0; i--) {
      if (!hadBye.has(pool[i].id)) {
        byePlayer = pool.splice(i, 1)[0]
        break
      }
    }
    if (!byePlayer) byePlayer = pool.pop()!
  }

  const matches: Match[] = []
  let index = 0
  const unpaired = [...pool]

  while (unpaired.length >= 2) {
    const p1 = unpaired.shift()!
    let opponentIdx = unpaired.findIndex((p) => !havePlayed(existingMatches, p1.id, p.id))
    if (opponentIdx === -1) opponentIdx = 0
    const p2 = unpaired.splice(opponentIdx, 1)[0]
    matches.push({
      id: createId('m'),
      round,
      index: index++,
      player1Id: p1.id,
      player2Id: p2.id,
      winnerId: null,
      status: 'ready',
    })
  }

  if (byePlayer) {
    matches.push({
      id: createId('m'),
      round,
      index: index++,
      player1Id: byePlayer.id,
      player2Id: null,
      winnerId: byePlayer.id,
      status: 'completed',
      isBye: true,
    })
  }

  return matches
}

export function createTournament(
  name: string,
  format: TournamentFormat,
  playerNames: string[],
): Tournament {
  // Rekkefølgen i lista = seed (første = seed 1)
  const players: Player[] = playerNames
    .map((n) => n.trim())
    .filter(Boolean)
    .map((name, index) => ({ id: createId('p'), name, seed: index + 1 }))

  if (players.length < 2) {
    throw new Error('Trenger minst 2 deltakere')
  }

  let matches: Match[]
  let totalRounds: number | undefined

  switch (format) {
    case 'cup':
      matches = buildCup(players)
      totalRounds = Math.max(...matches.map((m) => m.round))
      break
    case 'league':
      matches = buildLeague(players)
      totalRounds = Math.max(...matches.map((m) => m.round))
      break
    case 'round_robin':
      matches = buildRoundRobin(players)
      totalRounds = 1
      break
    case 'swiss':
      totalRounds = swissRoundCount(players.length)
      matches = buildSwissRound(players, [], 1)
      break
    default:
      throw new Error('Ukjent turneringsoppsett')
  }

  return {
    id: createId('t'),
    name: name.trim() || 'Uten navn',
    format,
    players,
    matches,
    createdAt: new Date().toISOString(),
    status: 'active',
    totalRounds,
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

function maybeGenerateNextSwissRound(tournament: Tournament, matches: Match[]): Match[] {
  if (tournament.format !== 'swiss') return matches
  const totalRounds = tournament.totalRounds ?? swissRoundCount(tournament.players.length)
  const currentRound = Math.max(0, ...matches.map((m) => m.round))
  if (currentRound === 0 || currentRound >= totalRounds) return matches

  const roundMatches = matches.filter((m) => m.round === currentRound)
  if (roundMatches.length === 0) return matches
  if (!roundMatches.every((m) => m.status === 'completed')) return matches

  // Don't generate if next round already exists
  if (matches.some((m) => m.round === currentRound + 1)) return matches

  const next = buildSwissRound(tournament.players, matches, currentRound + 1)
  return [...matches, ...next]
}

export function setMatchWinner(tournament: Tournament, matchId: string, winnerId: string): Tournament {
  let matches = tournament.matches.map((m) => ({ ...m }))
  const match = matches.find((m) => m.id === matchId)
  if (!match) return tournament
  if (match.isBye) return tournament
  if (match.status === 'completed' && match.winnerId === winnerId) return tournament

  // For swiss: block edits that would invalidate later rounds
  if (tournament.format === 'swiss') {
    const laterExists = matches.some((m) => m.round > match.round)
    if (laterExists && match.status === 'completed' && match.winnerId !== winnerId) {
      // Drop later rounds so swiss can be re-paired
      matches = matches.filter((m) => m.round <= match.round)
    }
  }

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
  matches = maybeGenerateNextSwissRound(tournament, matches)

  const allDone = isTournamentComplete({ ...tournament, matches })
  return {
    ...tournament,
    matches,
    status: allDone ? 'completed' : 'active',
  }
}

function isTournamentComplete(tournament: Tournament): boolean {
  if (tournament.format === 'swiss') {
    const totalRounds = tournament.totalRounds ?? swissRoundCount(tournament.players.length)
    const maxRound = Math.max(0, ...tournament.matches.map((m) => m.round))
    if (maxRound < totalRounds) return false
    return tournament.matches.every((m) => m.status === 'completed')
  }
  return tournament.matches.every((m) => m.status === 'completed')
}

export function getStandings(tournament: Tournament): Standing[] {
  const map = new Map<string, Standing>()
  for (const p of tournament.players) {
    map.set(p.id, { playerId: p.id, played: 0, wins: 0, losses: 0, points: 0 })
  }

  for (const m of tournament.matches) {
    if (m.status !== 'completed' || !m.winnerId) continue

    if (m.isBye || !m.player2Id) {
      const winner = map.get(m.winnerId)
      if (winner) {
        winner.wins++
        winner.points += 3
      }
      continue
    }

    if (!m.player1Id) continue
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

  return [...map.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.wins !== a.wins) return b.wins - a.wins
    const pa = tournament.players.find((p) => p.id === a.playerId)
    const pb = tournament.players.find((p) => p.id === b.playerId)
    return (pa?.seed ?? 99) - (pb?.seed ?? 99)
  })
}

export function getPlayer(tournament: Tournament, playerId: string | null): Player | null {
  if (!playerId) return null
  return tournament.players.find((p) => p.id === playerId) ?? null
}

export function getPlayerName(tournament: Tournament, playerId: string | null): string {
  if (!playerId) return 'TBD'
  return tournament.players.find((p) => p.id === playerId)?.name ?? 'Ukjent'
}

export function formatPlayerLabel(tournament: Tournament, playerId: string | null): string {
  const player = getPlayer(tournament, playerId)
  if (!player) return 'TBD'
  return `#${player.seed} ${player.name}`
}

export function getRounds(matches: Match[]): number[] {
  return [...new Set(matches.map((m) => m.round))].sort((a, b) => a - b)
}

export function roundLabel(format: TournamentFormat, round: number, totalRounds: number): string {
  if (format === 'round_robin') return 'Kamper'
  if (format === 'league' || format === 'swiss') return `Runde ${round}`
  if (round === totalRounds) return 'Finale'
  if (round === totalRounds - 1) return 'Semifinale'
  if (round === totalRounds - 2) return 'Kvartfinale'
  return `Runde ${round}`
}

export function usesBracket(format: TournamentFormat): boolean {
  return format === 'cup'
}

export function usesStandings(format: TournamentFormat): boolean {
  return format === 'league' || format === 'round_robin' || format === 'swiss'
}

export function progressPercent(tournament: Tournament): number {
  if (tournament.format === 'swiss') {
    const totalRounds = tournament.totalRounds ?? swissRoundCount(tournament.players.length)
    const perRound = Math.floor(tournament.players.length / 2)
    const expected = Math.max(1, totalRounds * perRound)
    const done = tournament.matches.filter(
      (m) => m.status === 'completed' && m.player1Id && m.player2Id && !m.isBye,
    ).length
    return Math.min(100, Math.round((done / expected) * 100))
  }

  const playable = tournament.matches.filter((m) => m.player1Id && m.player2Id && !m.isBye)
  if (playable.length === 0) return 0
  const done = playable.filter((m) => m.status === 'completed').length
  return Math.round((done / playable.length) * 100)
}

export function getLeaderId(tournament: Tournament): string | null {
  if (tournament.format === 'cup') {
    if (tournament.status !== 'completed') return null
    const maxRound = Math.max(...tournament.matches.map((m) => m.round))
    return tournament.matches.find((m) => m.round === maxRound && m.winnerId)?.winnerId ?? null
  }
  if (tournament.status !== 'completed') return null
  return getStandings(tournament)[0]?.playerId ?? null
}

/** Migrate legacy format keys from earlier MVP versions. */
export function normalizeFormat(format: string): TournamentFormat {
  if (format === 'single_elimination') return 'cup'
  if (format === 'cup' || format === 'league' || format === 'round_robin' || format === 'swiss') {
    return format
  }
  return 'cup'
}
