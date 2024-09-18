// https://adventofcode.com/2023/day/7

import { getFileStream } from './util';
const stream = getFileStream('src/input/day_07.txt')

type TCard = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
type THandMap = Map<TCard, number>
type THandWeight = 1 | 2 | 3 | 4 | 5 | 6 | 7

type TCamelHandData = {
  cards: string
  bet: number
  handWeight: THandWeight
}

const CARD_TO_VALUE_MAP: Record<TCard, number> = {
  'A': 14,
  'K': 13,
  'Q': 12,
  // 'J': 11, // part 1
  'J': 1, // part 2
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2
}

/**
 * Switch statement to return hand weights with standard rules
 */
function standardHandLogic(numberOfCardTypes: number, cardTypeTotals: number[]): THandWeight {
  switch (numberOfCardTypes) {
    case 1: {
      return 7 // five of a kind
    }

    case 2: {
      if (cardTypeTotals.includes(4)) {
        return 6 // four of a kind
      }
      return 5 // full house
    }

    case 3: {
      if (cardTypeTotals.includes(3)) {
        return 4 // three of a kind
      }
      return 3 // two pair
    }

    default: {
      if (cardTypeTotals.includes(2)) {
        return 2 // pair
      }
      return 1 // high card
    }
  }
}

// part 2
function jokerHandLogic(
  numberOfCardTypes: number,
  jokerCount: number
): THandWeight {
  switch (numberOfCardTypes) {
    case 1:
    case 2: {
      return 7 // five of a kind
    }

    case 3: {
      // best possible is four of a kind or full house
      return jokerCount > 1 ? 6 : 5
    }

    case 4: {
      return 4 // best possible is 3 of a kind
    }

    default: {
      return 2 // best possible is pair
    }
  }
}

/**
 * Evaluates cards based on total types (denoted by map.size)
 *```r
 * 1 type - five of a kind
 * 2 type - four of a kind OR full house
 * 3 type - three of a kind OR two pair
 * 4+ types - pair OR high card
 * ```
 */
function getCamelHandWeight(handMap: THandMap): THandWeight {
  const jokerCount = handMap.get('J')
  const numberOfCardTypes = handMap.size
  const typeTotals = [...handMap.values()]

  return jokerCount
    ? jokerHandLogic(numberOfCardTypes, jokerCount)
    : standardHandLogic(numberOfCardTypes, typeTotals)
}

function parseCamelHand(handData: string): TCamelHandData {
  const [cards, bet] = handData.split(' ')
  if (!cards || !bet) {
    throw new Error('Invalid hand data');
  }

  const cardMap: THandMap = new Map<TCard, number>()
  for (const _card of cards) {
    const card = _card as TCard
    const currentValue = cardMap.get(card)
    if (!currentValue) {
      cardMap.set(card, 1)
    } else {
      cardMap.set(card, currentValue + 1)
    }
  }

  return {
    cards,
    bet: parseInt(bet, 10),
    handWeight: getCamelHandWeight(cardMap)
  }
}

function sortHands(prev: TCamelHandData, next: TCamelHandData): number {
  const { handWeight: prevHandWeight, cards: prevCards } = prev || {}
  const { handWeight: nextHandWeight, cards: nextCards } = next || {}
  if (prevHandWeight > nextHandWeight) {
    return 1
  }
  if (nextHandWeight > prevHandWeight) {
    return -1
  }

  // tie breaker
  for (let cardIndex = 0; cardIndex < 5; cardIndex++) {
    const prevCard = (prevCards[cardIndex] || '') as TCard
    const nextCard = (nextCards[cardIndex] || '') as TCard

    const prevCardValue = CARD_TO_VALUE_MAP[prevCard]
    const nextCardValue = CARD_TO_VALUE_MAP[nextCard]
    if (prevCardValue > nextCardValue) {
      return 1
    }
    if (nextCardValue > prevCardValue) {
      return -1
    }
  }

  return 0
}

const hands: TCamelHandData[] = []
stream
  .on('line', line => {
    hands.push(parseCamelHand(line))
  })
  .on('close', () => {
    hands.sort(sortHands)
    let betTotal = 0
    for (const [index, { bet }] of hands.entries()) {
      betTotal += bet * (index + 1)
    }
    console.log('total', betTotal)
  })

// part 1
// get the hand type of each hand
// - create map of card values
// - based on # of entries in map, we determine hand type
// sort the hands from weakest to strongest
// - determine tie break for hands
// multiply each hand's bid by it's spot in the sorted list
// add up all the winnings

// part 2
// j are now wildcards, worth 1 point
// j serves to complete hands for best possible outcome
// assess number of jokers and then temporarily update the hand scoring
