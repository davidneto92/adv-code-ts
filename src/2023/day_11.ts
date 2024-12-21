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

const galaxies: TCoordinate[] = []
// const emptyRowIndexes: number[] = []
let emptyColumnIndexes: number[]
// const emptyColumnIndexes: number[] = []

/**
 * Reads each row and gets coordinates for each galaxy
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

  // if (isRowEmpty) {
  //   emptyRowIndexes.push(rowIndex)
  // }

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
    lineNumber = lineNumber + 1 + (isRowEmpty ? 1 : 0)
  })
  .on('close', () => {
    // refactor this later
    const actual: number[] = []
    emptyColumnIndexes.forEach((val: number, index: number) => {
      if (val === 0) {
        actual.push(index);
      }
    })

    // console.log({
    //   galaxies,
    //   emptyColumnIndexes: actual,
    //   // emptyRowIndexes,
    // })

    const adjustedGalaxies: TCoordinate[] = galaxies.map((galaxy) => {
      const columnUpdate = getOffset(galaxy[0], actual)
      // console.log(`${galaxy[0]} is larger than ${columnUpdate} values in ${actual}`)
      return [galaxy[0] + columnUpdate, galaxy[1]]
    })

    // console.log({ adjustedGalaxies })

    let distanceSum = 0
    for (let startingIndex = 0; startingIndex < adjustedGalaxies.length - 1; startingIndex++) {
      const startingGalaxy = adjustedGalaxies[startingIndex];

      for (let endingIndex = startingIndex + 1; endingIndex < adjustedGalaxies.length; endingIndex++) {
        const endingGalaxy = adjustedGalaxies[endingIndex]
        if (!startingGalaxy || !endingGalaxy) {
          throw new Error('missing galaxies')
        }
        const columnDiff = Math.abs(endingGalaxy[0] - startingGalaxy[0])
        const rowDiff = Math.abs(endingGalaxy[1] - startingGalaxy[1])
        // console.log('sum', columnDiff + rowDiff)
        distanceSum = distanceSum + columnDiff + rowDiff
      }
    }

    console.log(distanceSum)
  })
