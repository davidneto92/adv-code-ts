// https://adventofcode.com/2023/day/1

import { getFileStream } from './util';

// go line by line
// get first and last letter appearing in string, add together to create 2-digit number
// add each number together, print sum

const stream = getFileStream('src/input/day_01.txt')

const getFirstNumber = (input: string): number => {
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

  const first = getFirstNumber(input)
  const last = getFirstNumber(input.split('').reverse().join(''))

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
    let check = getFirstNumber(substring)
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

    // if no char digits string found, use getFirstNumber()
    check = getFirstNumber(input)
    if (!isNaN(check) && check < Infinity) {
      first = check
    }

    left += 1
  }

  let right = input.length
  // while (last === Infinity || right > input.length - 1) {
  while (last === Infinity || right >= 5) {
    let substring = input.slice(right - 3, right)
    let check = getFirstNumber(substring.split('').reverse().join(''))
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

    // if no char digits strings found, use getFirstNumber()
    check = getFirstNumber(substring.split('').reverse().join(''))
    if (!isNaN(check) && check < Infinity) {
      last = check
    }

    right -= 1
  }

  // console.log({ first, last }, '\n')
  return parseInt(`${first}${last}`)
}

let sum = 0
stream.on('line', line => {
  // console.log(sum)
  // const parsedValue = getfirstLastDigitsFromString(line)
  const parsedValue = getfirstLastWithConversion(line)
  sum += parsedValue
  console.log({ line, parsedValue, sum })
})
