import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import "./App.css";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

// todo: put in config
const api = "http://localhost:3000";

const getData = (filter: number = -1) => {
  if (filter > 0) {
    return axios.get(`${api}/trees?days=${filter}`);
  }
  return axios.get(`${api}/trees`);
};

function App() {
  const [data, setData] = useState<any>(undefined);
  const [filter, setFilter] = useState(-1);

  useEffect(() => {
    // TODO: async setup and better error handling (UI, React error boundaries, logging)
    getData()
      .then((r) => setData(r.data))
      .catch((r) => alert(`Something went wrong: ${r}`));
  }, []);

  const updateFilter = (value: number) => {
    setData(undefined);
    setFilter(value);
    getData(value)
      .then((r) => setData(r.data))
      .catch((r) => alert(`Something went wrong: ${r}`));
  };

  const dataset = data
    ? {
        labels: Object.keys(data).map((d) =>
          moment(new Date(parseInt(d))).format("YYYY-MM-DD")
        ),
        datasets: [
          {
            label: "Number of trees planted",
            data: Object.values(data) as number[],
          },
        ],
      }
    : { labels: [], datasets: [] };

  return (
    <>
      {/* TODO: Improve UI */}
      {data ? (
        <>
          <select
            value={filter}
            onChange={(e) => updateFilter(parseInt(e.target.value))}
          >
            <option value="-1">All</option>
            {[180, 90, 30].map((count) => (
              <option key={`filter-${count}`} value={count}>
                Last {count} days
              </option>
            ))}
          </select>
          <Chart
            type={"bar"}
            options={{
              scales: {
                x: {
                  display: false,
                },
              },
            }}
            data={dataset}
          />
        </>
      ) : (
        <div>Loading data... please wait.</div>
      )}
    </>
  );
}

export default App;
