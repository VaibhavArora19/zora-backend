import mongoose from "mongoose";
import bounty from "../models/bounty";
import { BountyDocument } from "../types/bounty";
import { calculateRewards } from "./calculate-score";
import { SplitContractService } from "./splitContract";
import { ClankerService } from "./clankerService";
import { ZoraBalanceService } from "./zoraBalanceService";
import { Address } from 'viem';

const splitContractService = new SplitContractService();
const clankerService = new ClankerService();
const zoraBalanceService = new ZoraBalanceService();

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

const processZoraBounty = async (bountyData: PopulatedBounty) => {
  // Calculate rewards using the same logic as upstream
  const rewards = calculateRewards(bountyData.creatorsPostsFarcaster[0], bountyData.creatorsPostsZora[0]);

  // Convert rewards to the format expected by the split contract (exactly as upstream)
  const recipients = rewards.map((reward) => ({
    address: reward.address as `0x${string}`,
    percentAllocation: Math.floor(reward.rewardPercentage * 100), // Convert percentage to basis points
  }));

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
    tokenAddress: bountyData.link as `0x${string}`,
  });
};

const processClankerBounty = async (bountyData: PopulatedBounty) => {
  // Get uncollected fees from Clanker
  const clankerRewards = await clankerService.getUncollectedFees(bountyData.link);

  // Collect rewards and send to split contract
  await clankerService.collectAndSendToSplit(bountyData.link, bountyData.splitAddress);

  // Calculate rewards using the same logic as upstream
  const rewards = calculateRewards(bountyData.creatorsPostsFarcaster[0], bountyData.creatorsPostsZora[0]);

  // Convert rewards to the format expected by the split contract (exactly as upstream)
  const recipients = rewards.map((reward) => ({
    address: reward.address as `0x${string}`,
    percentAllocation: Math.floor(reward.rewardPercentage * 100), // Convert percentage to basis points
  }));

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
    tokenAddress: bountyData.link as `0x${string}`,
  });
};

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
        select: "address likes_count recasts_count replies_count followers following",
      })
      .populate<{ creatorPostsZora: ICreatorPostZoraPoints[] }>({
        path: "creatorsPostsZora",
        model: "CreatorPostZora",
        select: "address marketCap uniqueHolders volume",
      })
      .exec()) as PopulatedBounty[];

    if (!bountyInfo || bountyInfo.length === 0) {
      return [];
    }

    for (const bountyData of bountyInfo) {
      try {
        if (bountyData.isZora) {
          await processZoraBounty(bountyData);
        } else {
          await processClankerBounty(bountyData);
        }

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

// Example usage
async function checkBalance() {
  try {
    const coinAddress = "0xYourCoinAddress" as Address;
    const userAddress = "0xUserAddress" as Address;
    
    const balance = await zoraBalanceService.getCoinBalance(coinAddress, userAddress);
    console.log(`Balance: ${balance.formattedBalance} ETH`);
  } catch (error) {
    console.error('Error:', error);
  }
}
