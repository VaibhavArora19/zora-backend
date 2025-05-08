import { ObjectId } from "mongoose";
import bounty from "../models/bounty";
import { BountyDocument, IBounty, ICreatorPostFarcaster, ICreatorPostZora } from "../types/bounty";
import { calculatePostScore } from "./calculate-score";

// Define a type for the populated result
interface PopulatedBounty extends Omit<BountyDocument, "creatorsPostsFarcaster" | "creatorsPostsZora"> {
  creatorsPostsFarcaster: ICreatorPostFarcaster[];
  creatorsPostsZora: ICreatorPostZora[];
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
      .populate<{ creatorsPostsFarcaster: ICreatorPostFarcaster[] }>({
        path: "creatorsPostsFarcaster",
        model: "CreatorPostFarcaster",
        select: "address likes_count recasts_count", // Only select fields we need
      })
      .populate<{ creatorPostsZora: ICreatorPostZora[] }>({
        path: "creatorsPostsZora",
        model: "CreatorPostZora",
        select: "address marketCap uniqueHolders volume", // Only select fields we need
      })
      .exec()) as PopulatedBounty[];

    if (!bountyInfo || bountyInfo.length === 0) {
      return [];
    }

    const usersScorePerBounty: any[] = [];

    bountyInfo.forEach((bounty) => {
      if (!bounty.creatorsPostsFarcaster || !bounty.creatorsPostsZora) return;

      //!we should use unique id here probably
      usersScorePerBounty.push({
        id: (bounty._id as ObjectId).toString(),
      });

      //@ts-ignore
      const farcasterScore = [];

      //@ts-ignore
      const zoraScore = [];

      bounty.creatorsPostsFarcaster.forEach(async (creatorPost) => {
        const score = calculatePostScore(creatorPost, "farcaster");

        farcasterScore.push({
          address: creatorPost.address,
          score: score,
        });
      });

      bounty.creatorsPostsZora.forEach(async (creatorPost) => {
        const score = calculatePostScore(creatorPost, "zora");

        zoraScore.push({
          address: creatorPost.address,
          score: score,
        });
      });

      usersScorePerBounty.push({
        id: (bounty._id as ObjectId).toString(),
        farcasterScore,
        zoraScore,
      });
    });

    // return usersScore;
  } catch (error) {
    console.error("Error in checkAndDistribute:", error);
    throw error;
  }
};
