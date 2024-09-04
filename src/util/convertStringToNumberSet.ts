// refactor to allow generics?
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
