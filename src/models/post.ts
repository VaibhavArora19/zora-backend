import mongoose, { Document, Schema } from "mongoose";
import { CreatorPost } from "../types/bounty";

export type CreatorPostDocument = Document & CreatorPost;

const creatorPostSchema = new Schema<CreatorPostDocument>({
  title: { type: String, required: true },
  metadata: { type: String, required: true },
  coinAddress: { type: String, required: true },
});

const creatorPostModel = mongoose.model<CreatorPostDocument>("CreatorPost", creatorPostSchema);

export default creatorPostModel;
