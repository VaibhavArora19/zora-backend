"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRewards = calculateRewards;
function calculateRewards(farcasterData, zoraData) {
    const farcasterWeight = 0.6;
    const zoraWeight = 0.4;
    const farcasterMetricWeights = {
        likes_count: 0.2,
        recasts_count: 0.15,
        replies_count: 0.15,
        followers: 0.25,
        following: 0.25,
    };
    const zoraMetricWeights = {
        marketCap: 0.5,
        uniqueHolders: 0.3,
        volume: 0.2,
    };
    const scoreMap = [];
    const addScore = (address, score) => {
        const existing = scoreMap.find((entry) => entry.address === address);
        if (existing) {
            existing.score += score;
        }
        else {
            scoreMap.push({ address, score });
        }
    };
    for (const metric in farcasterMetricWeights) {
        const key = metric;
        const total = farcasterData.reduce((sum, obj) => sum + (obj[key] || 0), 0);
        if (total === 0)
            continue;
        for (const obj of farcasterData) {
            const value = obj[key] || 0;
            const weight = farcasterWeight * farcasterMetricWeights[key];
            const normalized = (value / total) * weight;
            addScore(obj.address, normalized);
        }
    }
    for (const metric in zoraMetricWeights) {
        const key = metric;
        console.log("key: ", zoraData);
        const total = zoraData && zoraData.length > 0 ? zoraData === null || zoraData === void 0 ? void 0 : zoraData.reduce((sum, obj) => sum + (obj[key] || 0), 0) : 0;
        if (total === 0)
            continue;
        for (const obj of zoraData) {
            const value = obj[key] || 0;
            const weight = zoraWeight * zoraMetricWeights[key];
            const normalized = (value / total) * weight;
            addScore(obj.address, normalized);
        }
    }
    const totalScore = scoreMap.reduce((sum, entry) => sum + entry.score, 0);
    const rewardDistribution = scoreMap.map((entry) => ({
        address: entry.address,
        rewardPercentage: parseFloat(((entry.score / totalScore) * 100).toFixed(4)),
    }));
    return rewardDistribution;
}
