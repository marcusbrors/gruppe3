import type { Tournament } from '../types/tournament'
import { formatPlayerLabel, getStandings } from '../lib/tournamentLogic'

export function StandingsTable({ tournament }: { tournament: Tournament }) {
  const standings = getStandings(tournament)

  return (
    <div className="overflow-x-auto rounded-lg border border-forest/10 bg-white/60">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-forest/10 text-xs uppercase tracking-wide text-forest/50">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Spiller</th>
            <th className="px-4 py-3 font-medium">K</th>
            <th className="px-4 py-3 font-medium">S</th>
            <th className="px-4 py-3 font-medium">T</th>
            <th className="px-4 py-3 font-medium">Poeng</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr key={row.playerId} className="border-b border-forest/5 last:border-0">
              <td className="px-4 py-3 text-forest/50">{i + 1}</td>
              <td className="px-4 py-3 font-medium">
                {formatPlayerLabel(tournament, row.playerId)}
              </td>
              <td className="px-4 py-3">{row.played}</td>
              <td className="px-4 py-3">{row.wins}</td>
              <td className="px-4 py-3">{row.losses}</td>
              <td className="px-4 py-3 font-semibold text-moss">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
