// https://adventofcode.com/2023/day/7

import { getFileStream } from '../util';
const stream = getFileStream('input/2023/day_07.txt')

type TCard = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
const CARD_TO_VALUE_MAP: Record<TCard, number> = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 11,
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

type TCamelHandData = {
  cards: string
  bet: number
  handWeight: 1 | 2 | 3 | 4 | 5 | 6 | 7
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
function getCamelHandWeight(handMap: Map<string, number>): TCamelHandData['handWeight'] {
  const numberOfCardTypes = handMap.size
  const typeTotals = [...handMap.values()]

  switch (numberOfCardTypes) {
    case 1: {
      return 7 // five of a kind
    }

    case 2: {
      if (typeTotals.includes(4)) {
        return 6 // four of a kind
      }
      return 5 // full house
    }

    case 3: {
      if (typeTotals.includes(3)) {
        return 4 // three of a kind
      }
      return 3 // two pair
    }

    default: {
      if (typeTotals.includes(2)) {
        return 2 // pair
      }
      return 1 // high card
    }
  }
}

function parseCamelHand(handData: string): TCamelHandData {
  const [cards, bet] = handData.split(' ')
  if (!cards || !bet) {
    throw new Error('Invalid hand data');
  }

  const cardMap = new Map<string, number>()
  for (const card of cards) {
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
    // unshift or push?
    hands.push(parseCamelHand(line))
  })
  .on('close', () => {
    // console.log('unsorted', hands)
    hands.sort(sortHands)
    console.log('sorted', hands)

    let betTotal = 0
    for (const [index, { bet }] of hands.entries()) {
      betTotal += bet * (index + 1)
    }
    console.log('total', betTotal)
  })

// get the hand type of each hand
// - create map of card values
// - based on # of entries in map, we determine hand type
// sort the hands from weakest to strongest
// - determine tie break for hands
// multiply each hand's bid by it's spot in the sorted list
// add up all the winnings
