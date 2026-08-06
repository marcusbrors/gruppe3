import type { Match, Tournament } from '../types/tournament'
import { getPlayer, getStandings } from './tournamentLogic'

export interface PlayerStats {
  playerId: string
  name: string
  seed: number
  played: number
  wins: number
  losses: number
  byes: number
  points: number
  winRate: number
  rank: number
  form: ('W' | 'L' | 'B')[]
  streak: number
  streakType: 'W' | 'L' | null
  nextOpponentName: string | null
}

function completedChronological(matches: Match[]): Match[] {
  return matches
    .filter((m) => m.status === 'completed' && m.winnerId)
    .slice()
    .sort((a, b) => a.round - b.round || a.index - b.index)
}

export function getPlayerStats(tournament: Tournament, playerId: string): PlayerStats | null {
  const player = getPlayer(tournament, playerId)
  if (!player) return null

  const standings = getStandings(tournament)
  const rank = standings.findIndex((s) => s.playerId === playerId) + 1
  const row = standings.find((s) => s.playerId === playerId)

  let wins = 0
  let losses = 0
  let byes = 0
  let played = 0
  const form: ('W' | 'L' | 'B')[] = []

  for (const m of completedChronological(tournament.matches)) {
    const inMatch = m.player1Id === playerId || m.player2Id === playerId
    if (!inMatch) continue

    if (m.isBye || !m.player2Id) {
      byes++
      form.push('B')
      if (m.winnerId === playerId) wins++
      continue
    }

    played++
    if (m.winnerId === playerId) {
      wins++
      form.push('W')
    } else {
      losses++
      form.push('L')
    }
  }

  const recent = form.slice(-5)
  let streak = 0
  let streakType: 'W' | 'L' | null = null
  for (let i = form.length - 1; i >= 0; i--) {
    const r = form[i]
    if (r === 'B') continue
    if (!streakType) {
      streakType = r
      streak = 1
      continue
    }
    if (r === streakType) streak++
    else break
  }

  const nextReady = tournament.matches.find(
    (m) =>
      m.status === 'ready' &&
      !m.isBye &&
      (m.player1Id === playerId || m.player2Id === playerId),
  )
  let nextOpponentName: string | null = null
  if (nextReady) {
    const oppId =
      nextReady.player1Id === playerId ? nextReady.player2Id : nextReady.player1Id
    nextOpponentName = oppId ? getPlayer(tournament, oppId)?.name ?? null : null
  }

  return {
    playerId,
    name: player.name,
    seed: player.seed,
    played,
    wins,
    losses,
    byes,
    points: row?.points ?? wins * 3,
    winRate: played === 0 ? 0 : Math.round((wins / played) * 100),
    rank: rank || standings.length,
    form: recent,
    streak,
    streakType,
    nextOpponentName,
  }
}
