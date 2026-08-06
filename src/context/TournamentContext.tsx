import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { loadTournaments, saveTournaments } from '../data/storage'
import { createTournament, setMatchWinner } from '../lib/tournamentLogic'
import type { Tournament, TournamentFormat } from '../types/tournament'

interface TournamentContextValue {
  tournaments: Tournament[]
  addTournament: (name: string, format: TournamentFormat, players: string[]) => Tournament
  updateMatchWinner: (tournamentId: string, matchId: string, winnerId: string) => void
  getTournament: (id: string) => Tournament | undefined
  deleteTournament: (id: string) => void
}

const TournamentContext = createContext<TournamentContextValue | null>(null)

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>(() => loadTournaments())

  useEffect(() => {
    saveTournaments(tournaments)
  }, [tournaments])

  const addTournament = (name: string, format: TournamentFormat, players: string[]) => {
    const t = createTournament(name, format, players)
    setTournaments((prev) => [t, ...prev])
    return t
  }

  const updateMatchWinner = (tournamentId: string, matchId: string, winnerId: string) => {
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === tournamentId ? setMatchWinner(t, matchId, winnerId) : t,
      ),
    )
  }

  const getTournament = (id: string) => tournaments.find((t) => t.id === id)

  const deleteTournament = (id: string) => {
    setTournaments((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <TournamentContext.Provider
      value={{ tournaments, addTournament, updateMatchWinner, getTournament, deleteTournament }}
    >
      {children}
    </TournamentContext.Provider>
  )
}

export function useTournaments() {
  const ctx = useContext(TournamentContext)
  if (!ctx) throw new Error('useTournaments must be used within TournamentProvider')
  return ctx
}
