export type Bounty = {
  contract: string;
  title: string;
  metadata: string;
  creatorsPosts: {
    name: string;
    uri: string;
    posts: CreatorPost[];
  };
};

export type CreatorPost = {
  title: string;
  metadata: string;
  coinAddress: string;
};
