export const getLastItem = <T>(input: T[], defaultValue: T) => {
  return input[input.length - 1] ?? defaultValue
}
