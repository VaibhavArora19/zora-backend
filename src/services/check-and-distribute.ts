import mongoose, { Mongoose, ObjectId } from "mongoose";
import bounty from "../models/bounty";
import { BountyDocument, ICreatorPostFarcaster, ICreatorPostZora } from "../types/bounty";
import { calculateRewards } from "./calculate-score";

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

    for (const bounty of bountyInfo) {
      const rewards = calculateRewards(bounty.creatorsPostsFarcaster[0], bounty.creatorsPostsZora[0]);

      //distribute rewards here
    }
  } catch (error) {
    console.error("Error in checkAndDistribute:", error);
    throw error;
  }
};
