// https://adventofcode.com/2023/day/3

import { getFileStream, getFirstNumber } from '../util';

const stream = getFileStream('input/2023/day_03.txt');

const getEngineLine = (input: string): string[] => {
  return input.split('');
};

const symbolExistsInList = (list: string[]): boolean => {
  return list.some((char) => char !== '.' && isNaN(parseInt(char, 10)))
}

const parseEngineMap = (engine: string[][]): number => {
  const numbersNearSymbols: number[] = []

  for (let rowIndex = 0; rowIndex < engine.length; rowIndex++) {
    const row = engine[rowIndex]
    if (!row) {
      throw new Error('row does not exist');
    }

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const currentChar = row[columnIndex]
      if (!currentChar) {
        throw new Error('unable to get char');
      }

      // refactor to --> if (isNaN) { continue }
      const isCurrentCharValidNumber = !isNaN(parseInt(currentChar, 10))
      if (isCurrentCharValidNumber) {
        const currentNumber = getFirstNumber(row.slice(columnIndex).join(''))
        const foundNumberLength = currentNumber.toString().length
        let charToCheck: string[] = []

        // top
        const prevRow = engine[rowIndex - 1]
        if (prevRow) {
          const left = Math.max(columnIndex - 1, 0)
          const right = Math.min(columnIndex + foundNumberLength + 1, row.length)
          // console.log(currentNumber, prevRow.slice(left, right))
          charToCheck.push(...prevRow.slice(left, right))
        }
        // bottom
        const nextRow = engine[rowIndex + 1]
        if (nextRow) {
          const left = Math.max(columnIndex - 1, 0)
          const right = Math.min(columnIndex + foundNumberLength + 1, row.length)
          charToCheck.push(...nextRow.slice(left, right))
        }
        // left
        const previousChar = row[columnIndex - 1]
        if (previousChar) {
          charToCheck.push(previousChar)
        }
        // right
        const nextChar = row[columnIndex + foundNumberLength]
        if (nextChar) {
          charToCheck.push(nextChar)
        }

        if (symbolExistsInList(charToCheck)) {
          numbersNearSymbols.push(currentNumber)
        }

        // move column index to end of number
        columnIndex += foundNumberLength - 1
      }
    }
  }

  // console.log(numbersNearSymbols)
  return numbersNearSymbols.reduce((prev, curr) => prev + curr, 0)
};

let engineMap: string[][] = [];
stream
  .on('line', (gameData: string) => {
    // part 1
    engineMap.push(getEngineLine(gameData));
    return engineMap;
  })
  .on('close', () => {
    const result = parseEngineMap(engineMap);
    console.log({ result });
  });
