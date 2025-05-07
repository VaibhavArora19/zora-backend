export type Bounty = {
  contract: string;
  title: string;
  metadata: string;
  isFinalized: boolean;
  bountyAmount: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  creatorsPosts: string[];
};

export type CreatorPost = {
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
};
