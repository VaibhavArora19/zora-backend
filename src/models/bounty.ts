import mongoose, { Document, Schema } from "mongoose";
import { Bounty } from "../types/bounty";

export type BountyDocument = Document & Bounty;

const bountySchema = new Schema<BountyDocument>({
  contract: { type: String, required: true },
  title: { type: String, required: true },
  metadata: { type: String, required: true },
  creatorsPosts: [{ type: Schema.Types.ObjectId, ref: "CreatorPost" }],
});

const bountyModel = mongoose.model<BountyDocument>("Bounty", bountySchema);

export default bountyModel;
