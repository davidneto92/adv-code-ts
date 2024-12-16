// https://adventofcode.com/2023/day/11
import { distance } from 'mathjs'
import { getFileStream } from '../util';
const stream = getFileStream('input/2023/day_11.txt')

// read all lines
// create array sized to line length that will keep track of which columns are empty
// create array of row indexes that are empty
// as we read lines, add coordinates for each galaxy we find
// once all lines are read, update galaxy coords based on position and empty rows & columns
// run through galaxies and calculate distances between points

type TCoordinate = [number, number] // [column, row]

const galaxies: TCoordinate[] = []
const emptyRowIndexes: number[] = []
let emptyColumnIndexes: number[]
// const emptyColumnIndexes: number[] = []

function parseMapLine(input: string, rowIndex: number) {
  let isRowEmpty = true
  for (let index = 0; index < input.length; index++) {
    const element = input[index];
    // add galaxy and column
    if (element === '#') {
      isRowEmpty = false
      galaxies.push([index, rowIndex])
      emptyColumnIndexes[index] = 1
    }
  }

  // check row
  if (isRowEmpty) {
    emptyRowIndexes.push(rowIndex)
  }
}


let lineNumber = 0
stream
  .on('line', line => {
    if (emptyColumnIndexes === undefined) {
      emptyColumnIndexes = new Array(line.length).fill(0)
    }

    parseMapLine(line, lineNumber)
    lineNumber++
  })
  .on('close', () => {
    // emptyColumnIndexes = emptyColumnIndexes.filter(x => x)
    console.log({
      galaxies,
      emptyRowIndexes,
      emptyColumnIndexes
    })
  })
