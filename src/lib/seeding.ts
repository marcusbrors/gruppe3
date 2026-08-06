import type { Player } from '../types/tournament'

/** Standard bracket seed order for a power-of-two size (1-indexed seeds). */
export function bracketSeedOrder(size: number): number[] {
  let positions = [1, 2]
  while (positions.length < size) {
    const next: number[] = []
    const sum = positions.length * 2 + 1
    for (const seed of positions) {
      next.push(seed)
      next.push(sum - seed)
    }
    positions = next
  }
  return positions
}

/** Place players into bracket slots by seed. Missing lower seeds become byes. */
export function placeSeedsInBracket(players: Player[], bracketSize: number): (Player | null)[] {
  const bySeed = new Map(players.map((p) => [p.seed, p]))
  return bracketSeedOrder(bracketSize).map((seed) => bySeed.get(seed) ?? null)
}

export function sortBySeed(players: Player[]): Player[] {
  return [...players].sort((a, b) => a.seed - b.seed || a.name.localeCompare(b.name, 'no'))
}

export function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}
