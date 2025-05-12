import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bountyRoutes from "./routes/bounty";
import cron from "node-cron";
import { fetchCreatorsPostsAndSave, getBountyInfoAndSaveCreator } from "./services/creatorsPost";
import { postOnFarcaster } from "./tools/farcaster";
import { checkAndDistribute } from "./services/check-and-distribute";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bountyRoutes);

// cron.schedule("0 * * * *", async () => {
//   await getBountyInfoAndSaveCreator();
//!after calling this function, sleep here for 10 minutes before the formula call
// checkAndDistribute();
// });

app.get("/post", async (req, res) => {
  await getBountyInfoAndSaveCreator();
  res.json({ data: "" });
});

app.get("/check", async (req, res) => {
  // await fetchCreatorsPostsAndSave("something something");

  await checkAndDistribute();
});

mongoose.connect(process.env.DATABASE_URL as string);

app.listen(8000, () => {
  console.log("Server started at 8000");
});
