import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bountyRoutes from "./routes/bounty";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bountyRoutes);

mongoose.connect(process.env.DATABASE_URL as string);

app.listen(8000, () => {
  console.log("Server started at 8000");
});
