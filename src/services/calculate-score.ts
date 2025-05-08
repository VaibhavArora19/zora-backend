/**
 * Universal post scoring system for both Farcaster and Zora posts
 *
 * The formula balances engagement metrics, creator influence, and market indicators
 * to provide comparable scores across platforms.
 */

import { ICreatorPostFarcaster, ICreatorPostZora } from "../types/bounty";

// Configuration - adjust weights to fine-tune scoring priorities
const WEIGHTS = {
  // Engagement weights
  LIKES_WEIGHT: 0.3, // High impact - direct user endorsement
  RECASTS_WEIGHT: 0.35, // Highest impact - amplification of message
  REPLIES_WEIGHT: 0.2, // Medium impact - conversation generation

  // Market indicator weights
  MARKET_CAP_WEIGHT: 0.35, // High impact - overall market value
  VOLUME_WEIGHT: 0.3, // Medium-high impact - trading activity
  HOLDERS_WEIGHT: 0.35, // High impact - community distribution

  // Creator influence weights
  FOLLOWERS_WEIGHT: 0.75, // High impact - creator reach
  FOLLOWING_RATIO_WEIGHT: 0.25, // Low impact - network reciprocity

  // Category weights for final calculation
  ENGAGEMENT_WEIGHT: 0.5, // 50% of score based on engagement
  MARKET_WEIGHT: 0.3, // 30% of score based on market metrics
  INFLUENCE_WEIGHT: 0.2, // 20% of score based on creator influence
};

// Normalization coefficients
// These values help scale raw metrics to a 0-100 range
// Adjust based on typical values seen in your platform
const NORMALIZE = {
  // Farcaster normalization
  LIKES_NORM: 100, // Divide by this to normalize (e.g., 100 likes = 1.0)
  RECASTS_NORM: 50, // Recast has higher value (50 recasts = 1.0)
  REPLIES_NORM: 75, // (75 replies = 1.0)
  FOLLOWERS_NORM: 10000, // (10K followers = 1.0)

  // Zora normalization
  MARKET_CAP_NORM: 100000, // ($100K market cap = 1.0)
  VOLUME_NORM: 50000, // ($50K volume = 1.0)
  HOLDERS_NORM: 500, // (500 unique holders = 1.0)
};

/**
 * Score a Farcaster post based on engagement and influence metrics
 * @param {Object} post - Farcaster post object
 * @returns {number} - Score from 0-100
 */
function scoreFarcasterPost(post: ICreatorPostFarcaster) {
  // Get engagement score (50% of total)
  const engagementScore = calculateEngagementScore(post);

  // Get influence score (20% of total)
  const influenceScore = calculateInfluenceScore(post);

  // No market metrics for Farcaster, so we allocate those points proportionally
  const marketAdjustment = WEIGHTS.MARKET_WEIGHT / (WEIGHTS.ENGAGEMENT_WEIGHT + WEIGHTS.INFLUENCE_WEIGHT);

  // Calculate total score (0-100)
  const totalScore =
    (engagementScore * WEIGHTS.ENGAGEMENT_WEIGHT * (1 + marketAdjustment) + influenceScore * WEIGHTS.INFLUENCE_WEIGHT * (1 + marketAdjustment)) * 100;

  return Math.min(100, Math.max(0, totalScore)); // Ensure score is between 0-100
}

/**
 * Score a Zora post based on market metrics
 * @param {Object} post - Zora post object
 * @returns {number} - Score from 0-100
 */
function scoreZoraPost(post: ICreatorPostZora) {
  // Get market score (30% of total)
  const marketScore = calculateMarketScore(post);

  // No engagement metrics for Zora, so we allocate those points to market
  const engagementAdjustment = WEIGHTS.ENGAGEMENT_WEIGHT / WEIGHTS.MARKET_WEIGHT;

  // No influence metrics for Zora, so we allocate those points to market
  const influenceAdjustment = WEIGHTS.INFLUENCE_WEIGHT / WEIGHTS.MARKET_WEIGHT;

  // Calculate total score (0-100)
  const totalScore = marketScore * WEIGHTS.MARKET_WEIGHT * (1 + engagementAdjustment + influenceAdjustment) * 100;

  return Math.min(100, Math.max(0, totalScore)); // Ensure score is between 0-100
}

/**
 * Calculate engagement component score
 * @param {Object} post - Farcaster post
 * @returns {number} - Score from 0-1
 */
function calculateEngagementScore(post: ICreatorPostFarcaster) {
  // Normalize metrics to 0-1 range
  const normalizedLikes = Math.min(1, (post.likes_count || 0) / NORMALIZE.LIKES_NORM);
  const normalizedRecasts = Math.min(1, (post.recasts_count || 0) / NORMALIZE.RECASTS_NORM);

  // Parse replies count (it's defined as a string in the schema)
  const repliesCount = parseInt(post.replies_count || "0", 10);
  const normalizedReplies = Math.min(1, repliesCount / NORMALIZE.REPLIES_NORM);

  // Apply weights to each component
  return normalizedLikes * WEIGHTS.LIKES_WEIGHT + normalizedRecasts * WEIGHTS.RECASTS_WEIGHT + normalizedReplies * WEIGHTS.REPLIES_WEIGHT;
}

/**
 * Calculate influence component score
 * @param {Object} post - Farcaster post
 * @returns {number} - Score from 0-1
 */
function calculateInfluenceScore(post: ICreatorPostFarcaster) {
  // Normalize followers to 0-1 range
  const normalizedFollowers = Math.min(1, (post.followers || 0) / NORMALIZE.FOLLOWERS_NORM);

  // Calculate following ratio (followers/following) - higher is better
  // Using a sigmoid-like function to handle edge cases
  const followingCount = post.following || 1; // Prevent division by zero
  const followRatio = (post.followers || 0) / followingCount;
  const normalizedFollowRatio = Math.min(1, followRatio / 10); // Assuming 10:1 ratio is excellent

  // Apply weights to each component
  return normalizedFollowers * WEIGHTS.FOLLOWERS_WEIGHT + normalizedFollowRatio * WEIGHTS.FOLLOWING_RATIO_WEIGHT;
}

/**
 * Calculate market component score
 * @param {Object} post - Zora post
 * @returns {number} - Score from 0-1
 */
function calculateMarketScore(post: ICreatorPostZora) {
  // Normalize metrics to 0-1 range
  const normalizedMarketCap = Math.min(1, (post.marketCap || 0) / NORMALIZE.MARKET_CAP_NORM);
  const normalizedVolume = Math.min(1, (post.volume || 0) / NORMALIZE.VOLUME_NORM);
  const normalizedHolders = Math.min(1, (post.uniqueHolders || 0) / NORMALIZE.HOLDERS_NORM);

  // Apply weights to each component
  return normalizedMarketCap * WEIGHTS.MARKET_CAP_WEIGHT + normalizedVolume * WEIGHTS.VOLUME_WEIGHT + normalizedHolders * WEIGHTS.HOLDERS_WEIGHT;
}

/**
 * Universal scoring function that handles either platform
 * @param {Object} post - Either a Farcaster or Zora post
 * @param {string} platform - "farcaster" or "zora"
 * @returns {number} - Score from 0-100
 */
function scorePost(post: ICreatorPostFarcaster | ICreatorPostZora, platform: "farcaster" | "zora") {
  if (platform === "farcaster") {
    return scoreFarcasterPost(post as ICreatorPostFarcaster);
  } else if (platform === "zora") {
    return scoreZoraPost(post as ICreatorPostZora);
  } else {
    throw new Error("Unknown platform: " + platform);
  }
}

// Example usage
export function calculatePostScore(post: ICreatorPostFarcaster | ICreatorPostZora, platform: "farcaster" | "zora") {
  return scorePost(post, platform);
}

// Export the scoring function
module.exports = {
  calculatePostScore,
  scoreFarcasterPost,
  scoreZoraPost,
};
