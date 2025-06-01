import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bountyRoutes from "./routes/bounty";
import splitContractRoutes from "./routes/splitContract";
import cron from "node-cron";
import { getBountyInfoAndSaveCreator } from "./services/creatorsPost";
import { checkAndDistribute } from "./services/check-and-distribute";
import testRoutes from "./test";
import farcasterRoutes from './routes/farcaster';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bountyRoutes);
app.use(splitContractRoutes);
app.use(testRoutes);
app.use(farcasterRoutes);

cron.schedule("0 * * * *", async () => {
  await getBountyInfoAndSaveCreator();

  // after calling this function, sleep here for 10 minutes before the formula call
  setTimeout(() => {
    checkAndDistribute();
  }, 10 * 60 * 1000);
});

app.get("/", (req, res) => {
  res.send("Hello Coincast");
});

mongoose.connect(process.env.DATABASE_URL as string);

app.listen(8000, () => {
  console.log("Server started at 8000");
});
