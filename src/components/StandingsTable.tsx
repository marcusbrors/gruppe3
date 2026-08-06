import type { Tournament } from '../types/tournament'
import { getStandings } from '../lib/tournamentLogic'
import { useLocale } from '../context/LocaleContext'
import { PlayerHoverName } from './PlayerHoverName'

export function StandingsTable({ tournament }: { tournament: Tournament }) {
  const { t, locale } = useLocale()
  const standings = getStandings(tournament)
  const playedHeader = locale === 'en' ? 'P' : 'K'
  const winsHeader = locale === 'en' ? 'W' : 'S'
  const lossesHeader = locale === 'en' ? 'L' : 'T'

  return (
    <div className="overflow-x-auto rounded-lg border border-forest/10 bg-surface/60">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-forest/10 text-xs uppercase tracking-wide text-forest/50">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">{t('player')}</th>
            <th className="px-4 py-3 font-medium">{playedHeader}</th>
            <th className="px-4 py-3 font-medium">{winsHeader}</th>
            <th className="px-4 py-3 font-medium">{lossesHeader}</th>
            <th className="px-4 py-3 font-medium">{t('points')}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr key={row.playerId} className="border-b border-forest/5 last:border-0">
              <td className="px-4 py-3 text-forest/50">{i + 1}</td>
              <td className="px-4 py-3 font-medium">
                <PlayerHoverName tournament={tournament} playerId={row.playerId} />
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
