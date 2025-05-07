import express from "express";
import { createBounty } from "../controllers/bounty";

const router = express.Router();

router.get("/create/bounty", createBounty);

export default router;
