// https://adventofcode.com/2023/day/1

import { getFileStream } from './util';

// go line by line
// get first and last letter appearing in string, add together to create 2-digit number
// add each number together, print sum

const stream = getFileStream('src/input/day_01.txt')

const getFistNumber = (input: string): number => {
  let first = Infinity
  for (let index = 0; index < input.length; index++) {
    const parsedChar = parseInt(input.charAt(index))
    if (!Number.isNaN(parsedChar)) {
      first = parsedChar
      break
    }
  }

  return first
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

type TDigitNums = 'one' | 'two' | 'six' | 'four' | 'five' | 'nine' | 'three' | 'seven' | 'eight' | 'nine'
type TDigitSet = Record<TDigitNums, number>
type TDigitKey = keyof TDigitSet
const DIGITS: TDigitSet = {
  // 3 char length
  'one': 1,
  'two': 2,
  'six': 6,
  // 4 char length
  'four': 4,
  'five': 5,
  'nine': 9,
  // 5 char length
  'three': 3,
  'seven': 7,
  'eight': 8,
}

// part 2
const getfirstLastWithConversion = (input: string): number => {
  if (!input) {
    throw new Error('invalid line')
  }

  if (input.length <= 2) {
    return getfirstLastDigitsFromString(input)
  }

  let first = Infinity
  let last = Infinity

  let left = 0

  while (first === Infinity && left < input.length - 5) {
    // sliding window
    // check window of size 3
    let substring = input.slice(left, left + 3)
    if (['one', 'two', 'six'].includes(substring)) {
      first = DIGITS[substring as TDigitKey]
      break
    }
    // check window of size 4
    substring = input.slice(left, left + 4)
    if (['four', 'five', 'nine'].includes(substring)) {
      first = DIGITS[substring as TDigitKey]
      break
    }
    // check window of size 5
    substring = input.slice(left, left + 5)
    if (['three', 'seven', 'eight'].includes(substring)) {
      first = DIGITS[substring as TDigitKey]
      break
    }

    // if no char digits found, iterate through substring of length 5
    const check = getFistNumber(input)
    if (!isNaN(check) && check < Infinity) {
      first = check
    }

    left += 5
  }

  console.log({ first, last })
  return parseInt(`${first}${last}`)
}

stream.on('line', line => {
  const parsedValue = getfirstLastDigitsFromString(line)
  // const parsedValue = getfirstLastWithConversion(line)
  console.log({ parsedValue })
})
