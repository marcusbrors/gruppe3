import { normalizeFormat } from '../lib/tournamentLogic'
import type { Tournament } from '../types/tournament'

const KEY = 'kjell-games-tournaments'

export function loadTournaments(): Tournament[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Tournament[]
    return parsed.map((t) => ({
      ...t,
      format: normalizeFormat(t.format),
      players: t.players.map((p, index) => ({
        ...p,
        seed: typeof p.seed === 'number' && p.seed > 0 ? p.seed : index + 1,
      })),
    }))
  } catch {
    return []
  }
}

export function saveTournaments(tournaments: Tournament[]): void {
  localStorage.setItem(KEY, JSON.stringify(tournaments))
}
