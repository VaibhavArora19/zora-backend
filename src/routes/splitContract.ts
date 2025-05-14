import express from "express";
import { updateSplit, distributeSplit } from "../controllers/splitContract";

const router = express.Router();

router.post("/update-split", updateSplit);
router.post("/distribute-split", distributeSplit);

export default router; 