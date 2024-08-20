// https://adventofcode.com/2023/day/1

import { getFileStream, getFirstDigit } from './util';

const stream = getFileStream('src/input/day_01.txt')

// part 1
const getfirstLastDigitsFromString = (input: string): number => {
  if (!input || input.length === 0) {
    throw new Error('invalid line')
  }

  const first = getFirstDigit(input)
  const last = getFirstDigit(input.split('').reverse().join(''))

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

  // sliding window checking 3, 4, 5 length substrings

  let first = Infinity
  let last = Infinity

  let left = 0
  while (first === Infinity || left < input.length) {
    let substring = input.slice(left, left + 3)
    let check = getFirstDigit(substring)
    if (!isNaN(check) && check < Infinity) {
      first = check
      break
    }

    if (['one', 'two', 'six'].includes(substring)) {
      first = DIGITS[substring as TDigitKey]
      break
    }

    substring = input.slice(left, left + 4)
    if (['four', 'five', 'nine'].includes(substring)) {
      first = DIGITS[substring as TDigitKey]
      break
    }

    substring = input.slice(left, left + 5)
    if (['three', 'seven', 'eight'].includes(substring)) {
      first = DIGITS[substring as TDigitKey]
      break
    }

    check = getFirstDigit(input)
    if (!isNaN(check) && check < Infinity) {
      first = check
    }

    left += 1
  }

  let right = input.length
  while (last === Infinity || right >= 5) {
    let substring = input.slice(right - 3, right)
    let check = getFirstDigit(substring.split('').reverse().join(''))
    if (!isNaN(check) && check < Infinity) {
      last = check
      break
    }

    if (['one', 'two', 'six'].includes(substring)) {
      last = DIGITS[substring as TDigitKey]
      break
    }

    substring = input.slice(right - 4, right)
    if (['four', 'five', 'nine'].includes(substring)) {
      last = DIGITS[substring as TDigitKey]
      break
    }

    substring = input.slice(right - 5, right)
    if (['three', 'seven', 'eight'].includes(substring)) {
      last = DIGITS[substring as TDigitKey]
      break
    }

    check = getFirstDigit(substring.split('').reverse().join(''))
    if (!isNaN(check) && check < Infinity) {
      last = check
    }

    right -= 1
  }

  return parseInt(`${first}${last}`)
}

let sum = 0
stream
  .on('line', line => {
    const parsedValue = getfirstLastWithConversion(line)
    sum += parsedValue
  })
  .on('close', () => console.log(sum))
