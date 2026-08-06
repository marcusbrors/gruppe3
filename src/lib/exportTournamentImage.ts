import type { Tournament } from '../types/tournament'
import { FORMAT_LABELS } from '../types/tournament'
import { getPlayerName, getStandings, progressPercent } from './tournamentLogic'

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

/** Tegner en turneringsplakat og returnerer PNG data-URL. */
export function renderTournamentImage(tournament: Tournament): string {
  const width = 1080
  const height = 1350
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas ikke støttet')

  // Bakgrunn
  const bg = ctx.createLinearGradient(0, 0, width, height)
  bg.addColorStop(0, '#0a1628')
  bg.addColorStop(0.55, '#12233f')
  bg.addColorStop(1, '#0e1a2e')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  // Accent stripe
  ctx.fillStyle = '#DE1823'
  ctx.fillRect(0, 0, width * 0.18, 14)
  ctx.fillStyle = '#F67200'
  ctx.fillRect(width * 0.18, 0, width * 0.28, 14)
  ctx.fillStyle = '#9db7e0'
  ctx.fillRect(width * 0.46, 0, width * 0.54, 14)

  // Header
  ctx.fillStyle = '#F67200'
  ctx.font = '700 28px "DM Sans", sans-serif'
  ctx.fillText('KJELL GAMES × SOPRA STERIA', 64, 80)

  ctx.fillStyle = '#e8eef8'
  ctx.font = '800 64px Syne, "DM Sans", sans-serif'
  const title = tournament.name.length > 28 ? `${tournament.name.slice(0, 27)}…` : tournament.name
  wrapText(ctx, title, 64, 160, width - 128, 72)

  ctx.fillStyle = '#9db7e0'
  ctx.font = '600 28px "DM Sans", sans-serif'
  ctx.fillText(FORMAT_LABELS[tournament.format], 64, 320)

  const pct = progressPercent(tournament)
  ctx.fillStyle = '#f5f8fd'
  ctx.font = '700 26px "DM Sans", sans-serif'
  ctx.fillText(
    `${tournament.players.length} deltakere  ·  ${pct}% fremdrift  ·  ${
      tournament.status === 'completed' ? 'Fullført' : 'Pågår'
    }`,
    64,
    365,
  )

  // Progress bar
  roundRect(ctx, 64, 390, width - 128, 18, 9)
  ctx.fillStyle = '#243f66'
  ctx.fill()
  roundRect(ctx, 64, 390, ((width - 128) * pct) / 100, 18, 9)
  ctx.fillStyle = '#F67200'
  ctx.fill()

  // Standings / participants
  const standings = getStandings(tournament)
  let y = 470
  ctx.fillStyle = '#F67200'
  ctx.font = '700 24px "DM Sans", sans-serif'
  ctx.fillText('TABELL / SEEDING', 64, y)
  y += 36

  const rows = standings.slice(0, 12)
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const name = getPlayerName(tournament, row.playerId)
    const winRate = row.played === 0 ? 0 : Math.round((row.wins / row.played) * 100)

    roundRect(ctx, 64, y, width - 128, 56, 12)
    ctx.fillStyle = i % 2 === 0 ? '#1c3558' : '#17304f'
    ctx.fill()

    ctx.fillStyle = '#F67200'
    ctx.font = '800 22px Syne, sans-serif'
    ctx.fillText(`#${i + 1}`, 84, y + 36)

    ctx.fillStyle = '#f5f8fd'
    ctx.font = '600 24px "DM Sans", sans-serif'
    ctx.fillText(name.slice(0, 28), 150, y + 36)

    ctx.fillStyle = '#9db7e0'
    ctx.font = '600 20px "DM Sans", sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${row.wins}S–${row.losses}T  ·  ${winRate}%  ·  ${row.points}p`, width - 84, y + 36)
    ctx.textAlign = 'left'
    y += 66
  }

  // Recent completed matches
  y += 20
  ctx.fillStyle = '#F67200'
  ctx.font = '700 24px "DM Sans", sans-serif'
  ctx.fillText('SISTE RESULTATER', 64, y)
  y += 40

  const done = tournament.matches
    .filter((m) => m.status === 'completed' && m.winnerId && !m.isBye && m.player1Id && m.player2Id)
    .slice(-6)
    .reverse()

  if (done.length === 0) {
    ctx.fillStyle = '#9db7e0'
    ctx.font = '500 22px "DM Sans", sans-serif'
    ctx.fillText('Ingen ferdigspilte kamper ennå', 64, y)
  } else {
    for (const m of done) {
      const w = getPlayerName(tournament, m.winnerId)
      const lId = m.winnerId === m.player1Id ? m.player2Id : m.player1Id
      const l = getPlayerName(tournament, lId)
      ctx.fillStyle = '#e8eef8'
      ctx.font = '600 22px "DM Sans", sans-serif'
      ctx.fillText(`🏆 ${w}  slo  ${l}`, 64, y)
      y += 36
    }
  }

  // Footer
  ctx.fillStyle = '#9db7e0'
  ctx.font = '500 20px "DM Sans", sans-serif'
  ctx.fillText('Kjell Games Turneringshub', 64, height - 48)

  return canvas.toDataURL('image/png')
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy)
      line = word
      yy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, yy)
}

export function downloadTournamentImage(tournament: Tournament): void {
  const dataUrl = renderTournamentImage(tournament)
  const link = document.createElement('a')
  const safe = tournament.name.replace(/[^\w\-æøåÆØÅ ]+/gi, '').trim().replace(/\s+/g, '-') || 'turnering'
  link.download = `${safe}.png`
  link.href = dataUrl
  link.click()
}
