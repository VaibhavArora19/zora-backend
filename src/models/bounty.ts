import mongoose, { Schema } from "mongoose";
import { BountyDocument } from "../types/bounty";

const bountySchema = new Schema<BountyDocument>({
  zoraPostLink: { type: String, required: true },
  budget: { type: String, required: true },
  uniqueTag: { type: String, required: true, unique: true },
  campaignStartDate: { type: Date, required: true },
  campaignEndDate: { type: Date, required: true },
  isFinalized: { type: Boolean, default: false },
  keywords: { type: [String], required: true },
  creatorsPosts: [{ type: [Schema.Types.ObjectId], ref: "CreatorPost" }],
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const bountyModel = mongoose.model<BountyDocument>("Bounty", bountySchema);

export default bountyModel;
