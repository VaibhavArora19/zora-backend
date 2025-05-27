import { ICreatorPostFarcasterPoints, ICreatorPostZoraPoints } from "./check-and-distribute";

type FarcasterUser = {
  address: string;
  likes_count?: number;
  recasts_count?: number;
  replies_count?: number;
  followers?: number;
  following?: number;
};

type ZoraUser = {
  address: string;
  marketCap?: number;
  uniqueHolders?: number;
  volume?: number;
};

type ScoreEntry = {
  address: string;
  score: number;
};

type RewardEntry = {
  address: string;
  rewardPercentage: number;
};

export function calculateRewards(farcasterData: ICreatorPostFarcasterPoints[], zoraData: ICreatorPostZoraPoints[]): RewardEntry[] {
  const farcasterWeight = 0.6;
  const zoraWeight = 0.4;


  farcasterData = farcasterData || [];
  zoraData = zoraData || [];


  console.log("reached here farcasterData ", farcasterData)
  console.log("reached here zoraData ", zoraData)

  const farcasterMetricWeights: Record<keyof Omit<FarcasterUser, "address">, number> = {
    likes_count: 0.2,
    recasts_count: 0.15,
    replies_count: 0.15,
    followers: 0.25,
    following: 0.25,
  };

  const zoraMetricWeights: Record<keyof Omit<ZoraUser, "address">, number> = {
    marketCap: 0.5,
    uniqueHolders: 0.3,
    volume: 0.2,
  };

  const scoreMap: ScoreEntry[] = [];

  const addScore = (address: string, score: number) => {
    console.log("reached here addScore ", address, score)
    const existing = scoreMap.find((entry) => entry.address === address);
    if (existing) {
      existing.score += score;
    } else {
      scoreMap.push({ address, score });
    }
  };

  console.log("reached here scoreMap ", scoreMap)

  // Process Farcaster data
  if (farcasterData.length > 0) {
  for (const metric in farcasterMetricWeights) {
    const key = metric as keyof Omit<FarcasterUser, "address">;
    const total = farcasterData.reduce((sum, obj) => sum + (Number(obj[key]) || 0), 0);
    if (total === 0) continue;

    for (const obj of farcasterData) {
        const value = Number(obj[key]) || 0;
        const weight = farcasterWeight * farcasterMetricWeights[key];
        const normalized = (value / total) * weight;
        addScore(obj.address, normalized);
      }
    }
  }
  console.log("reached here scoreMap after farcaster ", scoreMap)

  // Process Zora data
  if (zoraData.length > 0) {    

  for (const metric in zoraMetricWeights) {
    const key = metric as keyof Omit<ZoraUser, "address">;
    const total = zoraData.reduce((sum, obj) => sum + (Number(obj[key]) || 0), 0);
    if (total === 0) continue;

    for (const obj of zoraData) {
      const value = Number(obj[key]) || 0;
      const weight = zoraWeight * zoraMetricWeights[key];
      const normalized = (value / total) * weight;
        addScore(obj.address, normalized);
      }
    }
  }


  console.log("reached here scoreMap after zora ", scoreMap)

  if (scoreMap.length === 0) {
    return [];
  }

  
  const totalScore = scoreMap.reduce((sum, entry) => sum + entry.score, 0);

  console.log("reached here totalScore ", totalScore)

  const rewardDistribution: RewardEntry[] = scoreMap.map((entry) => ({
    address: entry.address,
    rewardPercentage: totalScore > 0 ? parseFloat(((entry.score / totalScore) * 100).toFixed(4)) : 0,
  }));

  console.log("reached here rewardDistribution ", rewardDistribution)

  return rewardDistribution;
}
