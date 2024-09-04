// https://adventofcode.com/2023/day/5

import { convertStringToNumberSet, getFileStream } from './util';
const stream = getFileStream('src/input/day_05.txt')

function range(start: number, end: number): number[] {
  return [...Array(1 + end - start).keys()].map(v => start + v)
}

const CONVERSION_ORDER = [
  'seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location'
] as const
type TConversionType = typeof CONVERSION_ORDER

type TRange = {
  source: number[]
  destination: number[]
}

type TConversionMap = {
  ranges: TRange[]
  source?: TConversionType[number]
  destination?: TConversionType[number]
  min?: number
  max?: number
}

function buildConversionMap(input: string[]): TConversionMap {
  const mapData = input.shift()
  if (!mapData) {
    throw new Error('invalid conversion map data')
  }

  let ranges: TRange[] = []

  for (const rangeData of input) {
    const [destStart, sourceStart, mapRange] = rangeData.split(' ').map(val => parseInt(val, 10))
    if (destStart === undefined || sourceStart === undefined || mapRange === undefined) {
      throw new Error('invalid range data')
    }

    const sourceRange = range(sourceStart, sourceStart + mapRange - 1)
    const destinationRange = range(destStart, destStart + mapRange - 1)
    ranges.push({
      source: sourceRange, destination: destinationRange
    })
  }

  return { ranges }
}

let seedSet = new Set<number>()
let mapLineQueue: string[] = []
let conversionMaps: TConversionMap[] = []

stream
  .on('line', line => {
    if (line.startsWith('seeds:')) {
      const nums = line.split(':')[1]
      if (!nums) {
        throw new Error('invalid seeds line')
      }
      seedSet = convertStringToNumberSet(nums)
    } else if (line.length === 0) {
      if (mapLineQueue.length) {
        conversionMaps.push(buildConversionMap(mapLineQueue))
        mapLineQueue = []
      }
    } else {
      mapLineQueue.push(line)
    }
  })
  .on('close', () => {
    // handle clean up for end of file empty lines
    if (mapLineQueue.length) {
      conversionMaps.push(buildConversionMap(mapLineQueue))
      mapLineQueue = []
    }

    const seedsIterator = seedSet.values()
    const conversions: number[] = []

    console.log('total maps', conversionMaps.length)

    // iterate through seeds
    loopSeeds: for (const seed of seedsIterator) {
      let converted = Infinity

      // for each seed, run it through the maps
      loopConversions: for (const currentMap of conversionMaps) {
        const { ranges } = currentMap

        // check if seed is covered by any ranges in the map
        loopRanges: for (const { source, destination } of ranges) {
          const possibleIndex = source.indexOf(seed)
          if (possibleIndex !== -1 && destination[possibleIndex]) {
            converted = destination[possibleIndex]
            break loopRanges
          }
        }

        // no match found in ranges
        if (converted === Infinity) {
          converted = seed
        }
        conversions.push(converted)
      }
    }

    /**
     * Not working, dummy data is failing at water-to-light I think
     */
    console.log(conversions)
  })

// build set of seeds
// continue reading file to build each map
// iterate through seeds and to locations by iterating through all maps
