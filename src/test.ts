import express from "express";
import { checkAndDistribute } from "./services/check-and-distribute";

const router = express.Router();

router.get("/deposit", async (req, res) => {
  await checkAndDistribute();

  res.send({ message: "Deposit successful" });
});

export default router;
