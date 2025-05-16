import mongoose, { Schema } from "mongoose";
import { BountyDocument } from "../types/bounty";

const bountySchema = new Schema<BountyDocument>({
  title: { type: String, required: true },
  description: { type: String },
  hash: { type: String, required: true, unique: true },
  creatorAddress: { type: String, required: true },
  tokenId: { type: String },
  link: { type: String, required: true },
  isZora: { type: Boolean, default: false },
  budgetPercentage: { type: String, required: true },
  uniqueKeyword: { type: String, required: true, unique: true },
  splitAddress: { type: String, required: true },
  campaignStartDate: { type: Date, required: true },
  campaignEndDate: { type: Date, required: true },
  isFinalized: { type: Boolean, default: false },
  keywords: { type: [String], required: true },
  creatorsPostsFarcaster: [{ type: [Schema.Types.ObjectId], ref: "CreatorPostFarcaster" }],
  creatorsPostsZora: [{ type: [Schema.Types.ObjectId], ref: "CreatorPostZora" }],
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const bountyModel = mongoose.model<BountyDocument>("Bounty", bountySchema);

export default bountyModel;
