import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bountyRoutes from "./routes/bounty";
import cron from "node-cron";
import { getBountyInfoAndSaveCreator } from "./services/creatorsPost";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bountyRoutes);

cron.schedule("0 * * * *", async () => {
  await getBountyInfoAndSaveCreator();
});

mongoose.connect(process.env.DATABASE_URL as string);

app.listen(8000, () => {
  console.log("Server started at 8000");
});
