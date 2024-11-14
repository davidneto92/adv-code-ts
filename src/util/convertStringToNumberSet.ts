// refactor to return Set or Array?
export const convertStringToNumberSet = (input: string, numberSeparator = ' '): Set<number> => {
  const result = new Set<number>();
  const cleanedInput = input.trim().split(numberSeparator);
  cleanedInput.forEach((val) => {
    if (val && val.length >= 1) {
      result.add(parseInt(val, 10));
    }
  });

  return result;
};

// add this to the function below so we can get floats too!
interface IConversionOptions {
  separator?: string
  numberType?: 'int' | 'float'
}

export const convertStringToNumberArray = (input: string, numberSeparator = ' '): number[] => {
  const result: number[] = []
  const cleanedInput = input.trim().split(numberSeparator);
  cleanedInput.forEach((val) => {
    if (val && val.length >= 1) {
      result.push(parseInt(val));
    }
  });

  return result;
};
