import { Document, Types } from "mongoose";

export interface IBounty {
  title: string;
  description?: string;
  creatorAddress: string;
  tokenId?: string;
  hash: string;
  link: string;
  isZora: boolean;
  budgetPercentage: string;
  uniqueKeyword: string;
  splitAddress: string;
  campaignStartDate: Date;
  campaignEndDate: Date;
  keywords: string[];
  isFinalized: boolean;
  createdAt: Date;
  updatedAt: Date;
  creatorsPostsFarcaster: Types.ObjectId[];
  creatorsPostsZora: Types.ObjectId[];
}

export interface BountyDocument extends IBounty, Document {}

export interface ICreatorPostFarcaster {
  hash: string;
  username: string;
  display_name: string;
  pfp_url: string;
  followers: number;
  following: number;
  address: string;
  post: string;
  likes_count: number;
  recasts_count: number;
  likes: string[];
  recasts: string[];
  replies_count: string;
}

export interface ICreatorPostZora {
  address: string;
  creatorAddress: string;
  marketCap: number;
  uniqueHolders: number;
  mediaContent: string[];
  volume: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatorPostDocument extends ICreatorPostFarcaster, Document {}
