import express from "express";
import { createBounty, getActiveBountiesController, getAllBountiesController, getBountyByKeywordController } from "../controllers/bounty";

const router = express.Router();

router.post("/create/bounty", createBounty);

router.get("/bounty/all", getAllBountiesController);
router.get("/bounty/keyword/:keyword", getBountyByKeywordController);
router.get("/bounty/active", getActiveBountiesController);

export default router;
