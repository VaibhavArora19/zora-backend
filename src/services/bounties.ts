import mongoose from "mongoose";
import bounty from "../models/bounty";

export const getAllBounties = async () => {
  try {
    const bounties = await bounty.find({});

    return bounties;
  } catch (error) {
    throw error;
  }
};

export const getBountByKeyword = async (keyword: string) => {
  try {
    const bountyByKeyword = await bounty.findOne({ uniqueKeyword: keyword });

    return bountyByKeyword;
  } catch (error) {
    throw error;
  }
};

export const getActiveBounties = async () => {
  try {
    const activeBounties = await bounty.find({ campaignStartDate: { $lt: new Date() }, campaignEndDate: { $gt: new Date() } });

    return activeBounties;
  } catch (error) {
    throw error;
  }
};

export const getUpcomingBounties = async () => {
  try {
    const upcomingBounties = await bounty.find({ campaignStartDate: { $gt: new Date() } });

    return upcomingBounties;
  } catch (error) {
    throw error;
  }
};

export const getCompletedBounties = async () => {
  try {
    const completedBounties = await bounty.find({ campaignEndDate: { $lt: new Date() }, isFinalized: true });

    return completedBounties;
  } catch (error) {
    throw error;
  }
};

export const getBountyByAddress = async (creatorAddress: string) => {
  try {
    const bountyByAddress = await bounty.find({ creatorAddress });

    return bountyByAddress;
  } catch (error) {
    throw error;
  }
};
