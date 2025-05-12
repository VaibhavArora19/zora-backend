import { ObjectId } from "mongoose";
import bounty from "../models/bounty";
import { BountyDocument, ICreatorPostFarcaster, ICreatorPostZora } from "../types/bounty";
import { calculatePostScore } from "./calculate-score";

// Define a type for the populated result
interface PopulatedBounty extends Omit<BountyDocument, "creatorsPostsFarcaster" | "creatorsPostsZora"> {
  creatorsPostsFarcaster: Array<ICreatorPostFarcaster[]>;
  creatorsPostsZora: Array<ICreatorPostZora[]>;
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

    bountyInfo.forEach(async (bountyDetails) => {
      if (!bountyDetails.creatorsPostsFarcaster || !bountyDetails.creatorsPostsZora) return;
      //@ts-ignore
      const farcasterScore = [];

      //@ts-ignore
      const zoraScore = [];

      //@ts-ignore
      bountyDetails.creatorsPostsFarcaster[0].forEach(async (creatorPost: ICreatorPostFarcaster) => {
        const score = calculatePostScore(creatorPost, "farcaster");

        farcasterScore.push({
          address: creatorPost.address,
          score: score,
        });
      });

      //@ts-ignore
      bounty.creatorsPostsZora[0]?.forEach(async (creatorPost: ICreatorPostZora) => {
        const score = calculatePostScore(creatorPost, "zora");

        zoraScore.push({
          address: creatorPost.address,
          score: score,
        });
      });

      usersScorePerBounty.push({
        id: (bountyDetails._id as ObjectId).toString(),
        //@ts-ignore
        farcasterScore,
        //@ts-ignore
        zoraScore,
      });

      //!send scores here
      await bounty.findOneAndUpdate({ _id: bountyDetails._id }, { isFinalized: true });
    });

    console.log("Users Score Per Bounty:", usersScorePerBounty[0].farcasterScore);

    // return usersScore;
  } catch (error) {
    console.error("Error in checkAndDistribute:", error);
    throw error;
  }
};
