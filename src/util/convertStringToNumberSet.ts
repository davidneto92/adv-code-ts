interface IConversionOptions {
  separator?: string
  numberType?: 'int' | 'float'
}

export const convertStringToNumberSet = (input: string, options?: IConversionOptions): Set<number> => {
  const { numberType = 'int', separator = ' ' } = options || {}
  const parseFunction = numberType === 'int' ? parseInt : parseFloat

  const result = new Set<number>();
  const cleanedInput = input.trim().split(separator);
  cleanedInput.forEach((val) => {
    if (val && val.length >= 1) {
      result.add(parseFunction(val, 10));
    }
  });

  return result;
};

export const convertStringToNumberArray = (input: string, options?: IConversionOptions): number[] => {
  const { numberType = 'int', separator = ' ' } = options || {}
  const parseFunction = numberType === 'int' ? parseInt : parseFloat

  const result: number[] = []
  const cleanedInput = input.trim().split(separator);
  cleanedInput.forEach((val) => {
    if (val && val.length >= 1) {
      result.push(parseFunction(val, 10));
    }
  });

  return result;
};
