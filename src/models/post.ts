import mongoose, { Document, Schema } from "mongoose";
import { ICreatorPost } from "../types/bounty";

export interface CreatorPostDocument extends ICreatorPost, Document {}

const creatorPostSchema = new Schema<CreatorPostDocument>({
  hash: { type: String, required: true },
  username: { type: String, required: true },
  display_name: { type: String, required: true },
  pfp_url: { type: String, required: true },
  followers: { type: Number, required: true },
  following: { type: Number, required: true },
  address: { type: String, required: true },
  post: { type: String, required: true },
  likes_count: { type: Number, required: true },
  recasts_count: { type: Number, required: true },
  likes: { type: [String], required: true },
  recasts: { type: [String], required: true },
  replies_count: { type: String, required: true },
});

const creatorPostModel = mongoose.model<CreatorPostDocument>("CreatorPost", creatorPostSchema);

export default creatorPostModel;
