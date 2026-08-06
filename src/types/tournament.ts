export type TournamentFormat = 'cup' | 'league' | 'round_robin' | 'swiss'

/** Legacy format keys that may exist in localStorage */
export type LegacyTournamentFormat = TournamentFormat | 'single_elimination'

export type MatchStatus = 'pending' | 'ready' | 'completed'

export interface Player {
  id: string
  name: string
  /** 1 = høyest seed (sterkest / favoritt) */
  seed: number
}

export interface Match {
  id: string
  round: number
  index: number
  player1Id: string | null
  player2Id: string | null
  winnerId: string | null
  status: MatchStatus
  /** Next match id for cup advancement */
  nextMatchId?: string
  /** Slot in next match: 1 or 2 */
  nextSlot?: 1 | 2
  /** True when one player got a bye */
  isBye?: boolean
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
  /** Planned number of rounds (swiss / cup) */
  totalRounds?: number
}

export const FORMAT_LABELS: Record<TournamentFormat, string> = {
  cup: 'Cup',
  league: 'Liga',
  round_robin: 'Alle mot alle',
  swiss: 'Swiss stage',
}

export const FORMAT_DESCRIPTIONS: Record<TournamentFormat, string> = {
  cup: 'Utslagsturnering — tap og du er ute. Bracket med finale.',
  league: 'Dobbel serie — alle møter alle to ganger, med ligatabell.',
  round_robin: 'Enkel serie — alle møter alle én gang.',
  swiss: 'Flere runder der spillere med lik score møtes. Ingen tidlig utslagning.',
}

export const FORMAT_ORDER: TournamentFormat[] = ['cup', 'league', 'round_robin', 'swiss']
