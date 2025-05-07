import bounty from "../models/bounty";
import { ICreatorPost } from "../types/bounty";

const weights = {
  likes: 1,
  recasts: 3,
  impressions: 0.01,
};

export const checkAndDistribute = async () => {
  const bountyInfo = await bounty.find({ deadline: { $lt: new Date() }, isFinalized: false }).populate<{ creatorPosts: ICreatorPost[] }>({
    path: "creatorPosts",
    model: "CreatorPost", // Ensure the correct model name is used here
  });

  const usersScore: Array<{
    address: string;
    score: number;
  }> = [];

  bountyInfo.forEach((bounty) => {
    // Step 1: Calculate weighted score for each user
    bounty.creatorPosts.forEach((user) => {
      const score = user.likes_count * weights.likes + user.recasts_count * weights.recasts; // Ensure impressions_count is handled safely
      usersScore.push({
        address: user.address,
        score,
      });
    });

    // Step 2: Calculate total score
    const totalScore = usersScore.reduce((sum, user) => sum + user.score, 0);

    // Step 3: Distribute budget based on score proportion
    usersScore.forEach((user) => {
      user.score = totalScore > 0 ? (user.score / totalScore) * +bounty.budget : 0;
    });
  });

  return usersScore;
};
