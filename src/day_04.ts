import { getFileStream } from './util';

const stream = getFileStream('src/input/day_04.txt');

type TScratchcard = {
  winningNumbers: Set<number>;
  field: Set<number>;
};

// refactor to allow generics?
const convertStringNumsToSet = (input: string, numberSeparator = ' '): Set<number> => {
  const result = new Set<number>();
  const cleanedInput = input.trim().split(numberSeparator);
  cleanedInput.forEach((val) => {
    if (val && val.length >= 1) {
      result.add(parseInt(val, 10));
    }
  });

  return result;
};

const parseScratchyData = (scratchyData: string): TScratchcard => {
  const parsed = scratchyData.split(':');
  const allNumbers = parsed[1];
  if (!allNumbers) {
    throw new Error('invalid scratchy data');
  }
  const [winningNumbersData, fieldData] = allNumbers.split('|');

  if (!winningNumbersData || !fieldData) {
    throw new Error('no numbers on scratchy');
  }

  const winningNumbers = convertStringNumsToSet(winningNumbersData);
  const field = convertStringNumsToSet(fieldData);

  return {
    winningNumbers,
    field,
  };
};

const getScratchcardPoints = ({ winningNumbers, field }: TScratchcard): number => {
  let totalMatches = 0;
  const winningNumbersIterator = winningNumbers.values();
  for (const winningNumber of winningNumbersIterator) {
    if (field.has(winningNumber)) {
      totalMatches += 1;
    }
  }

  return totalMatches <= 1 ? totalMatches : 2 ** (totalMatches - 1);
};

let points = 0;
stream
  .on('line', (scratchy: string) => {
    // part 1
    const parsedScratchy = parseScratchyData(scratchy);
    const result = getScratchcardPoints(parsedScratchy);
    points += result;
  })
  .on('close', () => {
    console.log({ total: points });
  });

// part 2 idea
// create map of { gameNumber: numberOfCopies }
// can still iterate through all games, and access the map for X times to parse a game
