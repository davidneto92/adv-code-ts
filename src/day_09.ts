// https://adventofcode.com/2023/day/9
import { convertStringToNumberArray, getFileStream, getLastItem } from './util';
const stream = getFileStream('src/input/day_09.txt');

// iterate through line, getting list of differences
// keep finding differences until all are 0

interface IDiffSetsData {
  values: number[];
  allDiffEqualZero: boolean;
}

function getArrayOfDiff(values: number[]): IDiffSetsData {
  const result = [];
  let allDiffEqualZero = true;

  for (let index = 0; index < values.length; index++) {
    if (index === 0) {
      continue;
    }
    const prev = values[index - 1] as number;
    const current = values[index] as number;
    if (allDiffEqualZero && current - prev !== 0) {
      allDiffEqualZero = false;
    }
    result.push(current - prev);
  }

  return { values: result, allDiffEqualZero };
}

function processLine(input: string) {
  const initialValues = convertStringToNumberArray(input);
  const allSets: IDiffSetsData[] = [
    {
      values: initialValues,
      allDiffEqualZero: initialValues.every((x) => x === 0),
    },
  ];

  while (allSets[allSets.length - 1]?.allDiffEqualZero !== true) {
    const lastSet = getLastItem(allSets, { values: [], allDiffEqualZero: false });
    allSets.push(getArrayOfDiff(lastSet.values));
  }

  // let lineSum = 0;
  // part 1
  // allSets.forEach(({ values }) =>
  //   lineSum += getLastItem(values, 0)
  // )
  // return lineSum;

  // part 2
  for (let index = allSets.length - 1; index > 0; index--) {
    const currentSet = allSets[index]?.values;
    const nextSet = allSets[index - 1]?.values;
    if (!currentSet || !nextSet) {
      throw new Error('sets are busted');
    }

    const result = (nextSet[0] || 0) - (currentSet[0] || 0);
    nextSet.unshift(result);
  }

  return allSets[0]?.values[0] as number;
}

let sum = 0;
stream
  .on('line', (line) => {
    const lineValue = processLine(line);
    sum += lineValue;
  })
  .on('close', () => {
    console.log('sum:', sum);
  });
