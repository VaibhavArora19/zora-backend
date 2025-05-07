import mongoose, { Schema } from "mongoose";
import { BountyDocument } from "../types/bounty";

const bountySchema = new Schema({
  contract: { type: String, required: true },
  title: { type: String, required: true },
  metadata: { type: String, required: true },
  bountyAmount: { type: String, required: true },
  deadline: { type: Date, required: true },
  creatorsPosts: [{ type: [Schema.Types.ObjectId], ref: "CreatorPost" }],
  isFinalized: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const bountyModel = mongoose.model<BountyDocument>("Bounty", bountySchema);

export default bountyModel;
