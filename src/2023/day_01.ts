// https://adventofcode.com/2023/day/1

import { getFileStream, getFirstDigit } from '../util';

// go line by line
// get first and last letter appearing in string, add together to create 2-digit number
// add each number together, print sum

const stream = getFileStream('input/2023/day_01.txt')

// part 1
const getfirstLastDigitsFromString = (input: string): number => {
  if (!input || input.length === 0) {
    throw new Error('invalid line')
  }

  const first = getFirstDigit(input)
  const last = getFirstDigit(input.split('').reverse().join(''))

  return parseInt(`${first}${last}`)
}

let sum = 0
stream
  .on('line', line => {
    const parsedValue = getfirstLastDigitsFromString(line)
    sum += parsedValue
  })
  .on('close', () => console.log(sum))
