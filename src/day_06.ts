// https://adventofcode.com/2023/day/6

import { convertStringToNumberArray, getFileStream, getNumberRange } from './util';
const stream = getFileStream('src/input/day_06.txt')

function parseLine(line: string): number[] {
  const [, nums] = line.split(':')
  if (!nums) {
    throw new Error('invalid time segments')
  }
  return convertStringToNumberArray(nums)
}

function findMaxTimes(timeInput: number[], recordsToBeat: number[]): number[] {
  const timeInputIterator = timeInput.values()
  const recordsToBeatIterator = recordsToBeat.values()

  let results: number[] = []

  for (let resultIndex = 1; resultIndex <= timeInput.length; resultIndex++) {
    const currentTime: number = timeInputIterator.next().value
    const currentRecord: number = recordsToBeatIterator.next().value

    // quarters are not right, will do brute force first
    // const firstQuarter = Math.floor(currentTime * 0.25)
    // const fourthQuarter = Math.ceil(currentTime * 0.75)
    // const possibleRates = getNumberRange(firstQuarter, fourthQuarter)

    const possibleRates = getNumberRange(1, currentTime)

    let acc = 0
    for (const rate of possibleRates) {
      const calculatedDistance = (currentTime - rate) * rate
      if (calculatedDistance > currentRecord) {
        acc++
      }
    }

    results.push(acc)
  }

  return results
}

let timeInput: number[] = []
let recordsToBeat: number[] = []
let lineNumber = 1
stream
  .on('line', line => {
    if (lineNumber === 1) {
      timeInput = parseLine(line)
    } else if (lineNumber === 2) {
      recordsToBeat = parseLine(line)
    }
    lineNumber++
  })
  .on('close', () => {
    const result = findMaxTimes(timeInput, recordsToBeat)
    console.log('multiplied', result.reduce((x, y) => x * y))
  })

// given durations, find number of ways to beat "record time"
// finding all values between
// ((record - possibleMin) * diff) AND ((record - possibleMax) * diff)
// that are greater than record