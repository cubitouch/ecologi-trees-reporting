import { numDaysBetween } from "./utils";

test("computes difference between 2 dates", () => {
  // arrange
  const d1 = new Date(2020, 1, 1);
  const d2 = new Date(2021, 1, 1);

  // act
  const diff = numDaysBetween(d1, d2);

  // assert
  expect(diff).toBe(366);
});
