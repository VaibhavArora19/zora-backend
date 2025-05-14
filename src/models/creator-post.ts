import mongoose, { Document, Schema } from "mongoose";
import { ICreatorPostFarcaster } from "../types/bounty";

export interface CreatorPostFarcasterDocument extends ICreatorPostFarcaster, Document {}

const creatorPostFarcasterSchema = new Schema({
  hash: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  display_name: { type: String, required: true },
  pfp_url: { type: String, required: true },
  followers: { type: Number, required: true },
  following: { type: Number, required: true },
  address: { type: String, required: true },
  likes_count: { type: Number, required: true },
  recasts_count: { type: Number, required: true },
  post: { type: String, required: true },
  likes: { type: [String] },
  recasts: { type: [String] },
  replies_count: { type: String },
  timestamp: { type: Date, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const creatorPostZoraSchema = new Schema({
  address: { type: String, required: true, unique: true },
  creatorAddress: { type: String, required: true },
  marketCap: { type: Number, required: true },
  uniqueHolders: { type: Number, required: true },
  mediaContent: { type: Schema.Types.Mixed },
  volume: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const creatorPostFarcasterModel = mongoose.model("CreatorPostFarcaster", creatorPostFarcasterSchema);

const creatorPostZoraModel = mongoose.model("CreatorPostZora", creatorPostZoraSchema);

export default { creatorPostFarcasterModel, creatorPostZoraModel };
