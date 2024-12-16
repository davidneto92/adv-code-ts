// https://adventofcode.com/2024/day/1
import { convertStringToNumberArray, getFileStream } from '../util';
const stream = getFileStream('input/2024/day_01.txt')

const leftList: number[] = []
const rightList: number[] = []

stream
  .on('line', line => {
    const [left, right] = convertStringToNumberArray(line, { separator: '   ' }) as [number, number]
    leftList.push(left)
    rightList.push(right)
  })
  .on('close', () => {
    // part 1
    // leftList.sort((x, y) => x - y)
    // rightList.sort((x, y) => x - y)
    // const diff: number[] = []
    // while (leftList.length > 0 && rightList.length > 0) {
    //   const left = leftList.pop() as number
    //   const right = rightList.pop() as number
    //   diff.push(Math.abs(left - right))
    // }
    // const diffSum = diff.reduce((x, y) => x + y)
    // console.log('Sum of differences', diffSum)

    // part 2
    const rightListMap: Record<number, number> = {}
    rightList.forEach(val => {
      if (!rightListMap[val]) {
        rightListMap[val] = 0
      }
      rightListMap[val] = rightListMap[val] + 1
    })

    const quantitySum = leftList.reduce((acc: number, current: number) => {
      const result = current * (rightListMap[current] || 0)
      return acc + result
    }, 0)

    console.log(quantitySum)
  })
