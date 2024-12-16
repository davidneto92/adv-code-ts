// https://adventofcode.com/2024/day/2
import { getFileStream } from '../util';
const stream = getFileStream('input/2024/day_02.txt')

stream
  .on('line', line => {
    console.log('setup data')
  })
  .on('close', () => {
    console.log('parse the result')
  })
