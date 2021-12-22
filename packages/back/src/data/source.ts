import axios from "axios";
import fs from "fs";
import { apiUrl, localSample, readFromRemote } from "../shared/config";
import { numDaysBetween } from "../shared/utils";

interface DataResponse {
  responseCode: string;
  responseText: string;
  data: number[][];
}

let cachedResponse: DataResponse = readFromRemote
  ? undefined
  : JSON.parse(fs.readFileSync(localSample, "utf8"));

const fetchData = async (ignoreCache = false) => {
  /* TODOs:
        - do during startup or async
        - store in an easily restorable place (database?, S3 bucket?)
        - refresh daily (hourly?)
        - ensure it is threadsafe
        - error handling
        - `ignoreCache = false` parameter are here for testing purpose -> implement a better testable solution
    */

  if (!ignoreCache && cachedResponse) {
    return cachedResponse;
  }

  console.log(`Fetch from ${apiUrl}`);
  const response = await axios.get(apiUrl);
  const responseJson = await response.data;
  if (!ignoreCache) cachedResponse = responseJson;
  return responseJson;
};

// TODO: improve typing
let cachedAggregatedData: any = {};
const getAggregatedData = async (ignoreCache = false) => {
  if (!ignoreCache && Object.keys(cachedAggregatedData).length > 1)
    return cachedAggregatedData;

  const data = await fetchData(ignoreCache);
  if (data.responseCode !== "OK") return {};

  console.log(`Aggregate data`);
  const normalizedData = data.data.reduce((acc: any, item: any) => {
    // TODO: cleanup and optimize
    const key = new Date(new Date(item[1] * 1000).toDateString()).getTime();
    if (acc[key]) {
      acc[key] += item[0];
    } else {
      acc[key] = item[0];
    }
    return acc;
  }, {});
  if (!ignoreCache) cachedAggregatedData = normalizedData;

  return normalizedData;
};

const getFilteredAggregatedData = async (
  filter: number,
  ignoreCache = false
) => {
  const data = await getAggregatedData(ignoreCache);
  if (filter === -1) {
    return data;
  }
  const filteredData: any = {};
  Object.keys(data).forEach((key) => {
    // TODO: compute boundary and implement a simple numeric compare
    const diff = numDaysBetween(new Date(parseInt(key, 0)), new Date());
    if (diff <= filter) filteredData[key] = data[key];
  });
  return filteredData;
};

export { fetchData, getAggregatedData, getFilteredAggregatedData };
