import mongoose from "mongoose";
import bounty from "../models/bounty";

export const getAllBounties = async () => {
  try {
    const bounties = await bounty.find({}).lean();

    return bounties;
  } catch (error) {
    throw error;
  }
};

export const getBountByKeyword = async (keyword: string) => {
  try {
    const bountyByKeyword = await bounty.findOne({ uniqueKeyword: keyword }).lean();

    if (!bountyByKeyword) throw new Error("No bounty found");

    return {
      ...bountyByKeyword,
      status:
        bountyByKeyword.campaignStartDate < new Date() && bountyByKeyword.campaignEndDate > new Date()
          ? "active"
          : bountyByKeyword.campaignStartDate > new Date()
          ? "upcoming"
          : "completed",
    };
  } catch (error) {
    throw error;
  }
};

export const getActiveBounties = async () => {
  try {
    const activeBounties = await bounty.find({ campaignStartDate: { $lt: new Date() }, campaignEndDate: { $gt: new Date() } }).lean();

    return activeBounties.map((bounty) => {
      return {
        ...bounty,
        status: "active",
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getUpcomingBounties = async () => {
  try {
    const upcomingBounties = await bounty.find({ campaignStartDate: { $gt: new Date() } }).lean();

    return upcomingBounties.map((bounty) => {
      return {
        ...bounty,
        status: "upcoming",
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getCompletedBounties = async () => {
  try {
    const completedBounties = await bounty.find({ campaignEndDate: { $lt: new Date() }, isFinalized: true }).lean();

    return completedBounties.map((bounty) => {
      return {
        ...bounty,
        status: "completed",
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getBountyByAddress = async (creatorAddress: string) => {
  try {
    const bountyByAddress = await bounty.find({ creatorAddress }).lean();

    return bountyByAddress;
  } catch (error) {
    throw error;
  }
};
