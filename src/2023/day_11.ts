// https://adventofcode.com/2023/day/11
import { getFileStream } from '../util';
const stream = getFileStream('input/2023/day_11.txt');

// read all lines
// create array sized to line length that will keep track of which columns are empty
// create array of row indexes that are empty
// as we read lines, add coordinates for each galaxy we find
// once all lines are read, update galaxy coords based on position and empty rows & columns
// run through galaxies and calculate distances between points

type TCoordinate = [number, number] // [column, row]

let galaxies: TCoordinate[] = []
let emptyColumnIndexes: number[]

/**
 * Reads each row and get coordinates for each galaxy
 */
function parseMapLine(input: string, rowIndex: number): boolean {
  let isRowEmpty = true
  for (let index = 0; index < input.length; index++) {
    const element = input[index];
    if (element === '#') {
      isRowEmpty = false
      galaxies.push([index, rowIndex])
      emptyColumnIndexes[index] = 1
    }
  }

  return isRowEmpty
}

// checks how many values are less than the provided number
function getOffset(check: number, values: number[]): number {
  let result = 0
  values.forEach(val => {
    if (check > val) {
      result++
    }
  })
  return result
}

let lineNumber = 0

stream
  .on('line', (line) => {
    if (emptyColumnIndexes === undefined) {
      emptyColumnIndexes = new Array(line.length).fill(0)
    }
    // add row offset as we go
    const isRowEmpty = parseMapLine(line, lineNumber)
    // part 1
    // lineNumber = lineNumber + 1 + (isRowEmpty ? 1 : 0)
    // part 2
    lineNumber = lineNumber + 1 + (isRowEmpty ? 999999 : 0)
  })
  .on('close', () => {
    const actual: number[] = []
    emptyColumnIndexes.forEach((val: number, index: number) => {
      if (val === 0) {
        actual.push(index);
      }
    })

    galaxies = galaxies.map((galaxy) => {
      // part 1
      // const columnUpdate = getOffset(galaxy[0], actual)
      // part 2
      const columnUpdate = getOffset(galaxy[0], actual) * 999999
      return [galaxy[0] + columnUpdate, galaxy[1]]
    })

    let distanceSum = 0
    for (let startingIndex = 0; startingIndex < galaxies.length - 1; startingIndex++) {
      const startingGalaxy = galaxies[startingIndex];

      for (let endingIndex = startingIndex + 1; endingIndex < galaxies.length; endingIndex++) {
        const endingGalaxy = galaxies[endingIndex]
        if (!startingGalaxy || !endingGalaxy) {
          throw new Error('missing galaxies')
        }
        // add column distance and row distance
        distanceSum = distanceSum + Math.abs(endingGalaxy[0] - startingGalaxy[0]) + Math.abs(endingGalaxy[1] - startingGalaxy[1])
      }
    }

    console.log(distanceSum)
  })
