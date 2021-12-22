import { apiUrl } from "../shared/config";
import {
  fetchData,
  getAggregatedData,
  getFilteredAggregatedData,
} from "./source";

const axios = require("axios");
jest.mock("axios");

beforeEach(() => {
  jest.resetAllMocks();
});

test("fetches data", () => {
  // arrange
  axios.get.mockResolvedValue({});

  // act
  const data = fetchData(true);

  // assert
  expect(axios.get).toBeCalledWith(apiUrl);
});

test("aggregates data", async () => {
  // arrange
  axios.get.mockResolvedValue({
    data: {
      responseCode: "OK",
      responseText: "Success",
      data: [
        [1, 1559838175],
        [1, 1559838175],
        [2, 1559838175],
        [1, 1559838175],
        [1, 1562430175],
        [1, 1565108575],
        [1, 1565108575],
        [1, 1565108575],
        [1, 1565108575],
      ],
    },
  });

  // act
  const data = await getAggregatedData(true);

  // assert
  expect(data).toStrictEqual({
    "1559775600000": 5,
    "1562367600000": 1,
    "1565046000000": 4,
  });
});

test("filters data", async () => {
  // arrange
  axios.get.mockResolvedValue({
    data: {
      responseCode: "OK",
      responseText: "Success",
      data: [
        [1, 1559838175],
        [1, 1559838175],
        [2, 1559838175],
        [1, 1559838175],
        [1, 1562430175],
        [1, 1565108575],
        [1, 1640070400],
        [1, 1640070400],
        [1, 1640070400],
      ],
    },
  });

  // act
  const data = await getFilteredAggregatedData(30, true);

  // assert
  expect(data).toStrictEqual({
    "1640044800000": 3,
  });
});
