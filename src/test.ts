import express from "express";
import { checkAndDistribute } from "./services/check-and-distribute"

const router = express.Router();

router.get("/deposit", async (req, res) => {

  // try {
  //   const result =  await checkAndDistribute();
  //   res.send({ message: "Deposit successful", result });
  // } catch (error) {
  //   res.status(500).send({ message: "Deposit failed", error });
  // }
  console.log('reached here') 
});

export default router;