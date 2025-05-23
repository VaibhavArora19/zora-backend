import express from "express";
import {
  createBounty,
  getActiveBountiesController,
  getAllBountiesController,
  getBountyByAddressController,
  getBountyByKeywordController,
  getCompletedBountiesController,
  getUpcomingBountiesController,
} from "../controllers/bounty";

const router = express.Router();

router.post("/create/bounty", createBounty);

router.get("/bounty/all", getAllBountiesController);
router.get("/bounty/keyword/:keyword", getBountyByKeywordController);
router.get("/bounty/active", getActiveBountiesController);
router.get("/bounty/upcoming", getUpcomingBountiesController);
router.get("/bounty/completed", getCompletedBountiesController);
router.get("/bounty/address/:address", getBountyByAddressController);

export default router;
