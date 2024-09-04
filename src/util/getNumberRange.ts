/**
 * Generates an array of numbers filled with values including
 * the start and end params.
 */
export function getNumberRange(start: number, end: number): number[] {
  return [...Array(1 + end - start).keys()].map(v => start + v)
}
