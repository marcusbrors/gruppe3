import type { Match, Tournament } from '../types/tournament'
import { FORMAT_LABELS } from '../types/tournament'
import {
  getPlayerName,
  getRounds,
  progressPercent,
  roundLabel,
  getStandings,
} from './tournamentLogic'

export type ExportContent = 'standings' | 'bracket' | 'both'

export interface ExportImageOptions {
  content: ExportContent
}

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
  return yy
}

function shortName(name: string, max = 14): string {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name
}

function estimateHeight(tournament: Tournament, options: ExportImageOptions): number {
  let h = 470 // header + progress + padding
  const showStandings = options.content === 'standings' || options.content === 'both'
  const showBracket = options.content === 'bracket' || options.content === 'both'

  if (showStandings) {
    h += 40 + tournament.players.length * 66 + 24
  }
  if (showBracket) {
    const rounds = getRounds(tournament.matches)
    const maxInRound = Math.max(
      1,
      ...rounds.map((r) => tournament.matches.filter((m) => m.round === r).length),
    )
    h += 50 + maxInRound * 78 + 40
  }
  h += 80 // footer
  return Math.max(900, Math.min(h, 3200))
}

function drawHeader(ctx: CanvasRenderingContext2D, tournament: Tournament, width: number): number {
  ctx.fillStyle = '#DE1823'
  ctx.fillRect(0, 0, width * 0.18, 14)
  ctx.fillStyle = '#F67200'
  ctx.fillRect(width * 0.18, 0, width * 0.28, 14)
  ctx.fillStyle = '#9db7e0'
  ctx.fillRect(width * 0.46, 0, width * 0.54, 14)

  ctx.fillStyle = '#F67200'
  ctx.font = '700 28px "DM Sans", sans-serif'
  ctx.fillText('KJELL GAMES × SOPRA STERIA', 64, 80)

  ctx.fillStyle = '#e8eef8'
  ctx.font = '800 56px Syne, "DM Sans", sans-serif'
  const title = tournament.name.length > 32 ? `${tournament.name.slice(0, 31)}…` : tournament.name
  const titleBottom = wrapText(ctx, title, 64, 150, width - 128, 64)

  ctx.fillStyle = '#9db7e0'
  ctx.font = '600 26px "DM Sans", sans-serif'
  ctx.fillText(FORMAT_LABELS[tournament.format], 64, titleBottom + 48)

  const pct = progressPercent(tournament)
  ctx.fillStyle = '#f5f8fd'
  ctx.font = '700 24px "DM Sans", sans-serif'
  ctx.fillText(
    `${tournament.players.length} deltakere  ·  ${pct}% fremdrift  ·  ${
      tournament.status === 'completed' ? 'Fullført' : 'Pågår'
    }`,
    64,
    titleBottom + 90,
  )

  const barY = titleBottom + 115
  roundRect(ctx, 64, barY, width - 128, 18, 9)
  ctx.fillStyle = '#243f66'
  ctx.fill()
  roundRect(ctx, 64, barY, ((width - 128) * pct) / 100, 18, 9)
  ctx.fillStyle = '#F67200'
  ctx.fill()

  return barY + 50
}

function drawStandings(
  ctx: CanvasRenderingContext2D,
  tournament: Tournament,
  width: number,
  startY: number,
): number {
  let y = startY
  ctx.fillStyle = '#F67200'
  ctx.font = '700 24px "DM Sans", sans-serif'
  ctx.fillText('RESULTATER (1. → SIST)', 64, y)
  y += 36

  const standings = getStandings(tournament)
  for (let i = 0; i < standings.length; i++) {
    const row = standings[i]
    const name = getPlayerName(tournament, row.playerId)
    const winRate = row.played === 0 ? 0 : Math.round((row.wins / row.played) * 100)
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`

    roundRect(ctx, 64, y, width - 128, 56, 12)
    ctx.fillStyle = i % 2 === 0 ? '#1c3558' : '#17304f'
    ctx.fill()

    ctx.fillStyle = '#F67200'
    ctx.font = '800 22px Syne, sans-serif'
    ctx.fillText(medal, 84, y + 36)

    ctx.fillStyle = '#f5f8fd'
    ctx.font = '600 24px "DM Sans", sans-serif'
    ctx.fillText(name.slice(0, 28), 170, y + 36)

    ctx.fillStyle = '#9db7e0'
    ctx.font = '600 20px "DM Sans", sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${row.wins}S–${row.losses}T  ·  ${winRate}%  ·  ${row.points}p`, width - 84, y + 36)
    ctx.textAlign = 'left'
    y += 66
  }

  return y + 24
}

function drawMatchBox(
  ctx: CanvasRenderingContext2D,
  tournament: Tournament,
  match: Match,
  x: number,
  y: number,
  w: number,
) {
  const h = 64
  roundRect(ctx, x, y, w, h, 10)
  ctx.fillStyle = '#1c3558'
  ctx.fill()
  ctx.strokeStyle = '#F67200'
  ctx.lineWidth = 1.5
  ctx.stroke()

  const p1 = shortName(getPlayerName(tournament, match.player1Id))
  const p2 = shortName(getPlayerName(tournament, match.player2Id))
  const wId = match.winnerId

  ctx.font = '600 16px "DM Sans", sans-serif'
  ctx.fillStyle = wId && wId === match.player1Id ? '#F67200' : '#e8eef8'
  ctx.fillText(match.isBye ? `${p1} (bye)` : p1, x + 10, y + 24)
  ctx.fillStyle = wId && wId === match.player2Id ? '#F67200' : '#e8eef8'
  ctx.fillText(match.player2Id ? p2 : 'TBD', x + 10, y + 48)

  if (match.status === 'completed' && wId) {
    ctx.fillStyle = '#F67200'
    ctx.font = '700 14px "DM Sans", sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('W', x + w - 12, y + (wId === match.player1Id ? 24 : 48))
    ctx.textAlign = 'left'
  }
}

function drawBracket(
  ctx: CanvasRenderingContext2D,
  tournament: Tournament,
  width: number,
  startY: number,
): number {
  let y = startY
  ctx.fillStyle = '#F67200'
  ctx.font = '700 24px "DM Sans", sans-serif'
  ctx.fillText(tournament.format === 'cup' ? 'BRACKET' : 'KAMPER / RUNDER', 64, y)
  y += 28

  const rounds = getRounds(tournament.matches)
  const totalRounds = tournament.totalRounds ?? rounds.length
  const colGap = 16
  const colW = Math.min(
    240,
    (width - 128 - colGap * Math.max(0, rounds.length - 1)) / Math.max(1, rounds.length),
  )
  const rowH = 74

  const maxMatches = Math.max(
    1,
    ...rounds.map((r) => tournament.matches.filter((m) => m.round === r && !m.isBye).length ||
      tournament.matches.filter((m) => m.round === r).length),
  )

  for (let ri = 0; ri < rounds.length; ri++) {
    const round = rounds[ri]
    const matches = tournament.matches
      .filter((m) => m.round === round)
      .sort((a, b) => a.index - b.index)
    const x = 64 + ri * (colW + colGap)

    ctx.fillStyle = '#9db7e0'
    ctx.font = '700 16px "DM Sans", sans-serif'
    ctx.fillText(roundLabel(tournament.format, round, totalRounds), x, y)

    matches.forEach((m, mi) => {
      drawMatchBox(ctx, tournament, m, x, y + 16 + mi * rowH, colW)
    })
  }

  return y + 16 + maxMatches * rowH + 24
}

/** Tegner en turneringsplakat og returnerer PNG data-URL. */
export function renderTournamentImage(
  tournament: Tournament,
  options: ExportImageOptions = { content: 'both' },
): string {
  const showStandings = options.content === 'standings' || options.content === 'both'
  const showBracket = options.content === 'bracket' || options.content === 'both'

  if (!showStandings && !showBracket) {
    throw new Error('Velg minst resultater eller brackets')
  }

  const width = showBracket && showStandings ? 1400 : 1080
  const height = estimateHeight(tournament, options)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas ikke støttet')

  const bg = ctx.createLinearGradient(0, 0, width, height)
  bg.addColorStop(0, '#0a1628')
  bg.addColorStop(0.55, '#12233f')
  bg.addColorStop(1, '#0e1a2e')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  let y = drawHeader(ctx, tournament, width)

  if (showStandings) {
    y = drawStandings(ctx, tournament, width, y)
  }
  if (showBracket) {
    y = drawBracket(ctx, tournament, width, y)
  }

  ctx.fillStyle = '#9db7e0'
  ctx.font = '500 20px "DM Sans", sans-serif'
  const parts = [
    showStandings ? 'resultater' : null,
    showBracket ? 'brackets' : null,
  ].filter(Boolean)
  ctx.fillText(`Kjell Games Turneringshub · ${parts.join(' + ')}`, 64, height - 40)

  return canvas.toDataURL('image/png')
}

export function downloadTournamentImage(
  tournament: Tournament,
  options: ExportImageOptions = { content: 'both' },
): void {
  const dataUrl = renderTournamentImage(tournament, options)
  const link = document.createElement('a')
  const safe =
    tournament.name.replace(/[^\w\-æøåÆØÅ ]+/gi, '').trim().replace(/\s+/g, '-') || 'turnering'
  const suffix =
    options.content === 'both'
      ? 'full'
      : options.content === 'standings'
        ? 'resultater'
        : 'brackets'
  link.download = `${safe}-${suffix}.png`
  link.href = dataUrl
  link.click()
}
