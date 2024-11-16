// https://adventofcode.com/2023/day/10
import { getFileStream } from './util';
const stream = getFileStream('src/input/day_10.txt')

// This is kinda messy. Some good pieces, some bad error handling.

type TCoordinate = [number, number] // [column, row]
type TPipe = '|' | '-' | 'F' | '7' | 'J' | 'L'

function getPipeType(pos?: TCoordinate): TPipe | 'S' | '.' | undefined {
  if (!pos) {
    return undefined
  }
  const row = diagram[pos[1]]
  return row ? row[pos[0]] as TPipe : undefined
}

const getNextCoords = (current: TCoordinate, dir: 'top' | 'right' | 'bottom' | 'left'): TCoordinate => {
  const [currentColumn, currentRow] = current
  switch (dir) {
    case 'top':
      return [currentColumn, currentRow - 1]
    case 'right':
      return [currentColumn + 1, currentRow]
    case 'bottom':
      return [currentColumn, currentRow + 1]
    default:
      return [currentColumn - 1, currentRow]
  }
}

const getNextDirection = (currentCoord: TCoordinate, previousCoord?: TCoordinate): TCoordinate => {
  const currentPipe = getPipeType(currentCoord)
  let nextPossiblePosition: TCoordinate[] = []

  // handles starting case
  if (!previousCoord) {
    const topCoord = getNextCoords(currentCoord, 'top')
    const rightCoord = getNextCoords(currentCoord, 'right')
    const bottomCoord = getNextCoords(currentCoord, 'bottom')
    const leftCoord = getNextCoords(currentCoord, 'left')

    if (['7', 'F', '|'].includes(getPipeType(topCoord) || '')) {
      return topCoord
    } else if (['7', 'J', '-'].includes(getPipeType(rightCoord) || '')) {
      return rightCoord
    } else if (['L', 'J', '|'].includes(getPipeType(bottomCoord) || '')) {
      return bottomCoord
    } else {
      return leftCoord
    }
  }

  switch (currentPipe) {
    case 'F':
      nextPossiblePosition = [getNextCoords(currentCoord, 'right'), getNextCoords(currentCoord, 'bottom')]
      break;
    case '7':
      nextPossiblePosition = [getNextCoords(currentCoord, 'left'), getNextCoords(currentCoord, 'bottom')]
      break;
    case 'J':
      nextPossiblePosition = [getNextCoords(currentCoord, 'top'), getNextCoords(currentCoord, 'left')]
      break;
    case 'L':
      nextPossiblePosition = [getNextCoords(currentCoord, 'top'), getNextCoords(currentCoord, 'right')]
      break;
    case '|':
      nextPossiblePosition = [getNextCoords(currentCoord, 'top'), getNextCoords(currentCoord, 'bottom')]
      break;
    case '-':
      nextPossiblePosition = [getNextCoords(currentCoord, 'left'), getNextCoords(currentCoord, 'right')]
      break;
    case '.':
      throw new Error('got a .')
    default:
      throw new Error('undefined? not good')
  }

  nextPossiblePosition = nextPossiblePosition.filter(data => previousCoord[0] !== data[0] || previousCoord[1] !== data[1])

  if (!nextPossiblePosition[0]) {
    throw new Error('no matches found?')
  }

  return nextPossiblePosition[0]
}

function getLoopDistance(start: TCoordinate): number {
  let distance = 0
  let previousCoord = start
  let currentCoord = getNextDirection(start)

  while (getPipeType(currentCoord) !== 'S') {
    let temp = currentCoord
    currentCoord = getNextDirection(currentCoord, previousCoord)
    previousCoord = temp
    distance++
  }

  return distance
}

const diagram: string[][] = []
let lineNumber = 0
let startPosition: TCoordinate = [-1, -1]

stream
  .on('line', line => {
    const row: string[] = []
    for (let i = 0; i < line.length; i++) {
      const current = line[i] || ''
      row.push(current)

      if (current === 'S') {
        startPosition = [i, lineNumber]
      }
    }

    diagram.push(row)
    lineNumber++
  })
  .on('close', () => {
    const result = getLoopDistance(startPosition)
    console.log(Math.floor((result + 1) / 2))
  })
