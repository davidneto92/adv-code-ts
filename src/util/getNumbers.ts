/**
 * Returns first digit in a string as a number.
 * Will return @param fallback if no matches found.
 */
export const getFistDigit = (input: string, fallback = Infinity): number => {
  const result = /(?<=^.*?)(\d)/.exec(input)
  return result ? parseInt(result[0], 10) : fallback
}

/**
 * Returns first integer number in a string as a number.
 * Will return @param fallback if no matches found.
 */
export const getFirstNumber = (input: string, fallback = NaN): number => {
  const result = /(?<=^.*?)(\d+)/.exec(input)
  return result ? parseInt(result[0], 10) : fallback
}
