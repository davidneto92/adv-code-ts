// https://adventofcode.com/2023/day/8
import { lcm } from 'mathjs'
import { getFileStream } from '../util';
const stream = getFileStream('input/2023/day_08.txt')

type TTurnDirections = ('L' | 'R')[]
interface IDirectionElement {
  L: string
  R: string
}
interface IDirectionElementInstruction extends IDirectionElement {
  key: string
}

const getTurnDirections = (input: string): TTurnDirections => {
  return input.split('') as TTurnDirections
}

const getElementInstructions = (input: string): IDirectionElementInstruction => {
  const inputWithoutSymbols = input.replaceAll(/[=( ),]/g, '')
  if (inputWithoutSymbols.length !== 9) {
    throw new Error('invalid element direction input')
  }
  return {
    key: inputWithoutSymbols.slice(0, 3),
    L: inputWithoutSymbols.slice(3, 6),
    R: inputWithoutSymbols.slice(6)
  }
}

let directions: ('L' | 'R')[]
const allInstructions = new Map<string, IDirectionElement>()
stream
  .on('line', line => {
    if (!directions?.length) {
      directions = getTurnDirections(line)
    } else if (line) {
      const { key, L, R } = getElementInstructions(line)
      allInstructions.set(key, { L, R })
    }
  })
  // part 1
  // .on('close', () => {
  //   let current = 'AAA'
  //   let steps = 0
  //   let index = 0

  //   while (current !== 'ZZZ') {
  //     if (index > directions.length - 1) {
  //       index = 0
  //     }
  //     const nextDirection = directions[index]
  //     const currentOptions = allInstructions.get(current)

  //     if (!currentOptions || !nextDirection) {
  //       throw new Error('unable to find next step')
  //     }

  //     current = currentOptions[nextDirection]

  //     steps++
  //     index++
  //   }

  //   console.log(steps)
  // })
  // part 2
  .on('close', () => {
    // We are finding the lowest common multiple of all paths
    // so lets get the steps required for each path, and then calculate lcm.
    let paths: string[] = []
    allInstructions.forEach((_, key) => {
      if (key.endsWith('A')) {
        paths.push(key)
      }
    })

    const pathSteps: Record<string, number> = {}
    for (const path of paths) {
      let current = path
      let steps = 0
      let index = 0

      while (!current.endsWith('Z')) {
        if (index > directions.length - 1) {
          index = 0
        }
        const nextDirection = directions[index]
        const currentOptions = allInstructions.get(current)

        if (!currentOptions || !nextDirection) {
          throw new Error('unable to find next step')
        }
        current = currentOptions[nextDirection]

        steps++
        index++
      }

      pathSteps[path] = steps
    }

    const nums = Object.values(pathSteps)
    const result = nums.reduce((prev, curr) => lcm(prev, curr), 1)

    console.log('least common multiple', result)
  })
