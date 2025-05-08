import mongoose, { Schema } from "mongoose";
import { BountyDocument } from "../types/bounty";

const bountySchema = new Schema<BountyDocument>({
  zoraPostLink: { type: String, required: true },
  budget: { type: String, required: true },
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
