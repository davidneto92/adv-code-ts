// https://adventofcode.com/2024/day/1
import { getFileStream } from '../util';
const stream = getFileStream('input/2024/day_01.txt')

stream
  .on('line', line => {
    console.log('setup data')
  })
  .on('close', () => {
    console.log('parse the result')
  })
