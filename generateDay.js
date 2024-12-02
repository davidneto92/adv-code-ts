const fs = require('fs');
const Handlebars = require("handlebars");

const year = process.argv[2]
const yearNum = parseInt(year)

if (yearNum < 2015 || yearNum > 2024) {
  throw new Error('Please provide an Advent of Code year between 2015 and 2024.')
}

const FILE_PREFIX = 'day_'

const templateString = `// https://adventofcode.com/{{year}}/day/{{dayNumber}}
import { getFileStream } from '../util';
const stream = getFileStream('input/{{year}}/day_{{dayNumberZeroed}}.txt')

stream
  .on('line', line => {
    console.log('setup data')
  })
  .on('close', () => {
    console.log('parse the result')
  })
`

const logicFolderPath = `./src/${year}`
if (!fs.existsSync(logicFolderPath)) {
  fs.mkdirSync(logicFolderPath)
}
const inputFolderPath = `./input/${year}`
if (!fs.existsSync(inputFolderPath)) {
  fs.mkdirSync(inputFolderPath)
}

const totalDayFiles = fs.readdirSync(logicFolderPath).filter(file => file.startsWith(FILE_PREFIX)).length
const dayNumber = totalDayFiles + 1
const dayNumberZeroed = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`

if (dayNumber > 31) {
  console.warn(`All 31 day files have been created for ${year}.`)
  process.exit()
}

const handlebarsTemplate = Handlebars.compile(templateString)
const logicFilePath = `${logicFolderPath}/${FILE_PREFIX}${dayNumberZeroed}.ts`
fs.writeFileSync(logicFilePath, handlebarsTemplate({ dayNumber, dayNumberZeroed, year }))

const inputFilePath = `${inputFolderPath}/${FILE_PREFIX}${dayNumberZeroed}.txt`
fs.writeFileSync(inputFilePath, '')

console.log(`Generated files for ${year} Day ${dayNumberZeroed}\n - logic ${logicFilePath}\n - data  ${inputFilePath}`)
