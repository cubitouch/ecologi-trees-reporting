import cors from "cors";
import express from "express";
import { getFilteredAggregatedData } from "./data/source";
import { frontendUrl } from "./shared/config";

const app = express();
const port = 3000;
app.use(cors({ origin: frontendUrl }));

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/trees", async (req, res) => {
  const filter = (req.query?.days || "").toString() || "-1";
  const data = await getFilteredAggregatedData(parseInt(filter, 0));
  res.send(data);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
