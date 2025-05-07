import bounty from "../models/bounty";
import { ICreatorPost } from "../types/bounty";

const weights = {
  likes: 1,
  recasts: 3,
  impressions: 0.01,
};

export const checkAndDistribute = async () => {
  try {
    const bountyInfo = await bounty.find({ 
      campaignEndDate: { $lt: new Date() }, 
      isFinalized: false 
    })
    .lean()
    .populate<{ creatorsPosts: ICreatorPost[] }>({
      path: "creatorsPosts",
      model: "CreatorPost",
      select: 'address likes_count recasts_count' // Only select fields we need
    })
    .exec();

  const usersScore: Array<{
    address: string;
    score: number;
  }> = [];

  if (!bountyInfo || bountyInfo.length === 0) {
    return [];
  }

  bountyInfo.forEach((bounty) => {
    // Step 1: Calculate weighted score for each user
    if (!bounty.creatorsPosts) return;
    
    bounty.creatorsPosts.forEach((user) => {
      if (!user) return;
      const score = (user.likes_count || 0) * weights.likes + (user.recasts_count || 0) * weights.recasts;
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
  } catch (error) {
    console.error('Error in checkAndDistribute:', error);
    throw error;
  }
};
