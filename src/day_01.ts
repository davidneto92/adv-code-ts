// https://adventofcode.com/2023/day/1

import { getFileStream } from './util';

// go line by line
// get first and last letter appearing in string, add together to create 2-digit number
// add each number together, print sum

const stream = getFileStream('src/input/day_01.txt')

const getFistNumber = (input: string): number => {
  const result = /(?<=^.*?)(\d)/.exec(input)
  return result ? parseInt(result[0], 10) : Infinity
}

// part 1
const getfirstLastDigitsFromString = (input: string): number => {
  if (!input || input.length === 0) {
    throw new Error('invalid line')
  }

  const first = getFistNumber(input)
  const last = getFistNumber(input.split('').reverse().join(''))

  return parseInt(`${first}${last}`)
}

let sum = 0
stream
  .on('line', line => {
    const parsedValue = getfirstLastDigitsFromString(line)
    sum += parsedValue
  })
  .on('close', () => console.log(sum))
