import { Document, Types } from 'mongoose';

export interface IBounty {
  contract: string;
  title: string;
  metadata: string;
  isFinalized: boolean;
  bountyAmount: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  creatorsPosts: Types.ObjectId[];
}

export interface BountyDocument extends IBounty, Document {}

export interface ICreatorPost {
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

export interface CreatorPostDocument extends ICreatorPost, Document {}
