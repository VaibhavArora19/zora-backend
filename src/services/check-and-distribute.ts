import mongoose from "mongoose";
import bounty from "../models/bounty";
import { BountyDocument } from "../types/bounty";
import { calculateRewards } from "./calculate-score";
import { SplitContractService } from "./splitContract";

const splitContractService = new SplitContractService();

export type ICreatorPostFarcasterPoints = {
  _id: mongoose.Types.ObjectId;
  address: string;
  likes_count: number;
  recasts_count: number;
  replies_count: number;
  followers: number;
  following: number;
};

export type ICreatorPostZoraPoints = {
  _id: mongoose.Types.ObjectId;
  address: string;
  marketCap: number;
  uniqueHolders: number;
  volume: number;
};

// Define a type for the populated result
interface PopulatedBounty extends Omit<BountyDocument, "creatorsPostsFarcaster" | "creatorsPostsZora"> {
  creatorsPostsFarcaster: Array<ICreatorPostFarcasterPoints[]>;
  creatorsPostsZora: Array<ICreatorPostZoraPoints[]>;
}

export const checkAndDistribute = async () => {
  try {
    //@ts-ignore
    const bountyInfo = (await bounty
      .find({
        campaignEndDate: { $lt: new Date() },
        isFinalized: false,
      })
      .lean()
      .populate<{ creatorsPostsFarcaster: ICreatorPostFarcasterPoints[] }>({
        path: "creatorsPostsFarcaster",
        model: "CreatorPostFarcaster",
        select: "address likes_count recasts_count replies_count followers following", // Only select fields we need
      })
      .populate<{ creatorPostsZora: ICreatorPostZoraPoints[] }>({
        path: "creatorsPostsZora",
        model: "CreatorPostZora",
        select: "address marketCap uniqueHolders volume", // Only select fields we need
      })
      .exec()) as PopulatedBounty[];

    if (!bountyInfo || bountyInfo.length === 0) {
      return [];
    }

    for (const bountyData of bountyInfo) {
      const rewards = calculateRewards(bountyData.creatorsPostsFarcaster[0], bountyData.creatorsPostsZora[0]);

      // Convert rewards to the format expected by the split contract
      const recipients = rewards.map((reward) => ({
        address: reward.address as `0x${string}`,
        percentAllocation: Math.floor(reward.rewardPercentage * 100), // Convert percentage to basis points
      }));

      try {
        // Update the split contract with new recipients
        await splitContractService.updateSplit({
          splitAddress: bountyData.splitAddress as `0x${string}`,
          recipients,
          distributorFeePercent: 1, // 1% distributor fee
          totalAllocationPercent: 10000, // 100% in basis points
        });

        // Distribute the funds
        await splitContractService.distributeSplit({
          splitAddress: bountyData.splitAddress as `0x${string}`,
          tokenAddress: bountyData.link as `0x${string}`, // Assuming link is the token address
        });

        // Mark bounty as finalized
        await bounty.findOneAndUpdate({ _id: bountyData._id }, { $set: { isFinalized: true } });
      } catch (error) {
        console.error(`Error processing bounty ${bountyData._id}:`, error);
        // Continue with next bounty even if this one fails
        continue;
      }
    }
  } catch (error) {
    console.error("Error in checkAndDistribute:", error);
    throw error;
  }
};
