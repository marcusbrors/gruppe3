const ADJECTIVES = [
  'Kaotiske',
  'Episke',
  'Legendariske',
  'Svettete',
  'Dramatiske',
  'Mystiske',
  'Kaosaktige',
  'Ultrakule',
  'Halvveis-seriøse',
  'Overhypede',
  'Kaotikalske',
  'Gloriose',
  'Råkule',
  'Nervepirrende',
  'Absurde',
]

const NOUNS = [
  'Potetcup',
  'Lunsjliga',
  'Fredagsfeide',
  'Sofa-showdown',
  'Kaffe-clash',
  'Kontor-krigen',
  'Taco-trophy',
  'Meme-masters',
  'Bananslaget',
  'Wifi-wars',
  'Deadline-derby',
  'Slack-slagmark',
  'Kantine-cup',
  'PowerPoint-pokalen',
  'Standup-skandalen',
]

const SUFFIXES = [
  '3000',
  'Xtra Extreme',
  'Edition',
  'Rematch',
  'Ultimate',
  'Revenge Tour',
  'Open',
  'Invitational',
  'Championship (nesten)',
  'of Destiny',
]

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]!
}

/** Genererer et morsomt turneringsnavn. */
export function suggestTournamentName(): string {
  const pattern = Math.floor(Math.random() * 4)
  switch (pattern) {
    case 0:
      return `${pick(ADJECTIVES)} ${pick(NOUNS)}`
    case 1:
      return `${pick(NOUNS)}: ${pick(SUFFIXES)}`
    case 2:
      return `Den ${pick(ADJECTIVES).toLowerCase()} ${pick(NOUNS)}`
    default:
      return `${pick(ADJECTIVES)} ${pick(NOUNS)} ${pick(SUFFIXES)}`
  }
}

/** Flere unike forslag. */
export function suggestTournamentNames(count = 3): string[] {
  const names = new Set<string>()
  let guard = 0
  while (names.size < count && guard < 40) {
    names.add(suggestTournamentName())
    guard++
  }
  return [...names]
}
