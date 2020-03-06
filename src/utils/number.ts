/**
 * @function reverseString
 * @description reverse string
 * @param value string we want to reverse
 */

export const reverseString = (value: string): string =>
  value
    .split('')
    .reverse()
    .join('');

/**
 * @function generateSegmentedNumber
 * @description generate number with segments of 3
 * @param {number | string} value we want to show
 */
export const generateSegmentedNumber = (value: number | string = 0): string => {
  return reverseString(
    reverseString(value.toString())
      .match(/.{1,3}/g)
      .join(',')
  );
};
