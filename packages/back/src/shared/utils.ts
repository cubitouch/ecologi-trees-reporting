// https://stackoverflow.com/questions/6154689/how-to-check-if-date-is-within-30-days
// TODO: use moment
const numDaysBetween = (d1: Date, d2: Date) => {
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return diff / (1000 * 60 * 60 * 24);
};

export { numDaysBetween };
