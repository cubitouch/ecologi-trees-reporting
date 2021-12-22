import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "./App";

const axios = require("axios");
jest.mock("axios");

beforeEach(() => {
  jest.resetAllMocks();
});

test("shows loader before data is displayed", async () => {
  // arrange
  axios.get.mockResolvedValue({ data: {} });

  // act
  render(<App />);
  const loader = screen.getByText(/Loading data... please wait./i);

  // assert
  expect(loader).toBeInTheDocument();
});

test("hides loader after data is displayed", async () => {
  // arrange
  axios.get.mockResolvedValue({
    data: {
      "1559775600000": 180,
      "1562367600000": 341,
      "1565046000000": 270,
      "1567724400000": 533,
      "1570316400000": 725,
    },
  });

  // act
  render(<App />);
  const loader = screen.getByText(/Loading data... please wait./i);
  await waitForElementToBeRemoved(() =>
    screen.getByText(/Loading data... please wait./i)
  );

  // assert
  expect(axios.get).toBeCalledWith("http://localhost:3000/trees");
  expect(loader).not.toBeInTheDocument();
});

test("runs corresponding query after changing the time range", async () => {
  // arrange
  const filterValue = "30";
  axios.get.mockResolvedValue({
    data: {
      "1559775600000": 180,
      "1562367600000": 341,
      "1565046000000": 270,
      "1567724400000": 533,
      "1570316400000": 725,
    },
  });

  // act
  render(<App />);
  await waitForElementToBeRemoved(() =>
    screen.getByText(/Loading data... please wait./i)
  );
  userEvent.selectOptions(screen.getByRole("combobox"), [filterValue]);
  await waitForElementToBeRemoved(() =>
    screen.getByText(/Loading data... please wait./i)
  );

  // assert
  expect(axios.get).toBeCalledWith("http://localhost:3000/trees");
  expect(axios.get).toBeCalledWith("http://localhost:3000/trees?days=30");
});
