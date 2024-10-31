const fs = require('fs');
const Handlebars = require("handlebars");

const templateString = `// https://adventofcode.com/2023/day/{{dayNumber}}
import { getFileStream } from './util';
const stream = getFileStream('src/input/day_{{dayNumberZeroed}}.txt')

stream
  .on('line', line => {
    console.log('setup data')
  })
  .on('close', () => {
    console.log('parse the result')
  })
`

const FILE_PREFIX = 'day_'

const totalDayFiles = fs.readdirSync('./src')
  .filter(file => file.startsWith(FILE_PREFIX))
  .length

const dayNumber = totalDayFiles + 1
const dayNumberZeroed = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`

if (dayNumber > 31) {
  console.warn('All 31 day files have been created.')
  process.exit()
}

const handlebarsTemplate = Handlebars.compile(templateString)
const logicFilePath = `./src/${FILE_PREFIX}${dayNumberZeroed}.ts`
fs.writeFileSync(logicFilePath, handlebarsTemplate({ dayNumber, dayNumberZeroed }))

const inputFilePath = `./src/input/${FILE_PREFIX}${dayNumberZeroed}.txt`
fs.writeFileSync(inputFilePath, '')

console.log(`Generated files for Day ${dayNumberZeroed}\n - logic ${logicFilePath}\n - data ${inputFilePath}`)
