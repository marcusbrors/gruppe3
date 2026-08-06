export type TournamentFormat = 'single_elimination' | 'round_robin'

export type MatchStatus = 'pending' | 'ready' | 'completed'

export interface Player {
  id: string
  name: string
}

export interface Match {
  id: string
  round: number
  index: number
  player1Id: string | null
  player2Id: string | null
  winnerId: string | null
  status: MatchStatus
  /** Next match id for single elimination advancement */
  nextMatchId?: string
  /** Slot in next match: 1 or 2 */
  nextSlot?: 1 | 2
}

export interface Standing {
  playerId: string
  played: number
  wins: number
  losses: number
  points: number
}

export interface Tournament {
  id: string
  name: string
  format: TournamentFormat
  players: Player[]
  matches: Match[]
  createdAt: string
  status: 'setup' | 'active' | 'completed'
}

export const FORMAT_LABELS: Record<TournamentFormat, string> = {
  single_elimination: 'Cup (single elimination)',
  round_robin: 'Serie (alle mot alle)',
}
