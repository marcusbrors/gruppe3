import type { Locale } from '../i18n/translations'

const NO = {
  adjectives: [
    'Kaotiske', 'Episke', 'Legendariske', 'Svettete', 'Dramatiske', 'Mystiske',
    'Ultrakule', 'Halvveis-seriøse', 'Overhypede', 'Gloriose', 'Råkule', 'Absurde',
  ],
  nouns: [
    'Potetcup', 'Lunsjliga', 'Fredagsfeide', 'Sofa-showdown', 'Kaffe-clash',
    'Kontor-krigen', 'Taco-trophy', 'Meme-masters', 'Wifi-wars', 'Deadline-derby',
    'Kantine-cup', 'PowerPoint-pokalen', 'Standup-skandalen',
  ],
  suffixes: [
    '3000', 'Xtra Extreme', 'Edition', 'Rematch', 'Ultimate', 'Revenge Tour',
    'Open', 'Invitational', 'Championship (nesten)', 'of Destiny',
  ],
  den: (adj: string, noun: string) => `Den ${adj.toLowerCase()} ${noun}`,
}

const EN = {
  adjectives: [
    'Chaotic', 'Epic', 'Legendary', 'Sweaty', 'Dramatic', 'Mysterious',
    'Ultra-cool', 'Semi-serious', 'Overhyped', 'Glorious', 'Ridiculous', 'Absurd',
  ],
  nouns: [
    'Potato Cup', 'Lunch League', 'Friday Feud', 'Couch Showdown', 'Coffee Clash',
    'Office Wars', 'Taco Trophy', 'Meme Masters', 'Wifi Wars', 'Deadline Derby',
    'Cafeteria Cup', 'PowerPoint Prize', 'Standup Scandal',
  ],
  suffixes: [
    '3000', 'Xtra Extreme', 'Edition', 'Rematch', 'Ultimate', 'Revenge Tour',
    'Open', 'Invitational', 'Championship (almost)', 'of Destiny',
  ],
  den: (adj: string, noun: string) => `The ${adj} ${noun}`,
}

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]!
}

export function suggestTournamentName(locale: Locale = 'no'): string {
  const pack = locale === 'en' ? EN : NO
  const pattern = Math.floor(Math.random() * 4)
  switch (pattern) {
    case 0:
      return `${pick(pack.adjectives)} ${pick(pack.nouns)}`
    case 1:
      return `${pick(pack.nouns)}: ${pick(pack.suffixes)}`
    case 2:
      return pack.den(pick(pack.adjectives), pick(pack.nouns))
    default:
      return `${pick(pack.adjectives)} ${pick(pack.nouns)} ${pick(pack.suffixes)}`
  }
}

export function suggestTournamentNames(count = 3, locale: Locale = 'no'): string[] {
  const names = new Set<string>()
  let guard = 0
  while (names.size < count && guard < 40) {
    names.add(suggestTournamentName(locale))
    guard++
  }
  return [...names]
}
