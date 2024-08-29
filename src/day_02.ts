// https://adventofcode.com/2023/day/2

import { getFileStream, getFirstNumber } from './util';

type TColor = 'red' | 'blue' | 'green'
const LIMITS: Record<TColor, number> = {
  red: 12,
  blue: 14,
  green: 13,
}
type TParsedGameData = {
  red: number,
  blue: number,
  green: number,
}

const getDiceColor = (input: string): string => {
  const result = /(red|green|blue)/.exec(input)
  return result ? result[0] : ''
}

/**
 * Returns id of game or 0 if the presented totals are witihn global limits
 */
const evalGameData = ({ red, blue, green }: TParsedGameData, id: number): number | 0 => {
  return red <= LIMITS.red && blue <= LIMITS.blue && green <= LIMITS.green
    ? id
    : 0
}

/**
 * Parses game data string and id if game is valid, or 0 if the game is invalid.
 */
const parseGameData = (gameData: string): number | 0 => {
  let validGameId = getFirstNumber(gameData)
  let games: string[]

  games = gameData.split(':')
  if (games[1]?.length) {
    games = games[1].split(';')
  } else {
    throw new Error('no game data present')
  }

  for (let gameIndex = 0; gameIndex < games.length; gameIndex++) {
    let parsedData: TParsedGameData = { red: 0, blue: 0, green: 0 }
    const game = games[gameIndex];
    if (!game) {
      throw new Error('invalid game data')
    }

    const diceCounts = game.split(',')
    for (let diceIndex = 0; diceIndex < diceCounts.length; diceIndex++) {
      const diceResult = diceCounts[diceIndex] || '';
      const count = getFirstNumber(diceResult)
      const color = getDiceColor(diceResult) as TColor

      if (!color.length) {
        const errorStr = `invalid color detected within Game ${validGameId}`
        throw new Error(errorStr)
      }

      parsedData[color] += count
    }

    validGameId = evalGameData(parsedData, validGameId)
    if (!validGameId) {
      break
    }
  }

  return validGameId
}

const parseGameDataPart2 = (gameData: string): number | 0 => {
  let validGameId = getFirstNumber(gameData)
  let games: string[]

  games = gameData.split(':')
  if (games[1]?.length) {
    games = games[1].split(';')
  } else {
    throw new Error('no game data present')
  }

  let maxColorValues: TParsedGameData = { red: 0, blue: 0, green: 0 }
  // iterates through all rounds
  for (let gameIndex = 0; gameIndex < games.length; gameIndex++) {
    const game = games[gameIndex];
    if (!game) {
      throw new Error('invalid game data')
    }

    const diceCounts = game.split(',')
    // iterates through color results in a round
    for (let diceIndex = 0; diceIndex < diceCounts.length; diceIndex++) {
      const diceResult = diceCounts[diceIndex] || '';
      const count = getFirstNumber(diceResult)
      const color = getDiceColor(diceResult) as TColor

      if (!color.length) {
        const errorStr = `invalid color detected within Game ${validGameId}`
        throw new Error(errorStr)
      }

      maxColorValues[color] = Math.max(maxColorValues[color], count)
    }
  }

  const powers = Object
    .values(maxColorValues)
    .reduce((acc: number, current: number) => acc * current, 1)
  return powers
}

const stream = getFileStream('src/input/day_02.txt')
let idSum = 0
let powerSum = 0
stream
  .on('line', (gameData: string) => {
    // part 1
    // const validId = parseGameData(gameData)
    // part 2
    powerSum += parseGameDataPart2(gameData)
  })
  .on('close', () => console.log({ powerSum }))
