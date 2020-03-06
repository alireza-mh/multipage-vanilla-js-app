/* Math random may not be uniq here but it will do the trick for now */

const semiUniq = (min= 1 , max = 300): number => {
  return Math.floor(Math.random()*(max-min) + min);
}
export default semiUniq;
