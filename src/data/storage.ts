import type { Tournament } from '../types/tournament'

const KEY = 'kjell-games-tournaments'

export function loadTournaments(): Tournament[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Tournament[]
  } catch {
    return []
  }
}

export function saveTournaments(tournaments: Tournament[]): void {
  localStorage.setItem(KEY, JSON.stringify(tournaments))
}
