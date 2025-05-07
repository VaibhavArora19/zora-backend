import express from "express";
import { createBounty } from "../controllers/bounty";

const router = express.Router();

router.post("/create/bounty", createBounty);

export default router;
