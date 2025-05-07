import { fetchByMention } from "../tools/farcaster";
import creatorsPost from "../models/post";
import Bounty from "../models/bounty";

export const getCreatorsPosts = async (tag: string) => {
  const response = await fetchByMention("20", tag);

  const filteredData = response.results.casts.map((cast: any) => {
    return {
      hash: cast.hash,
      username: cast.author.username,
      display_name: cast.author.display_name,
      pfp_url: cast.author.pfp_url,
      followers: cast.author.follower_count,
      following: cast.author.following_count,
      address: cast.author.custody_address,
      post: cast.author.text,
      likes_count: cast.author.reactions.likes_count,
      recasts_count: cast.author.reactions.recasts_count,
      likes: cast.author.reactions.likes.fname,
      recasts: cast.author.reactions.recasts.fname,
      replies_count: cast.author.reactions.replies_count,
    };
  });

  return filteredData;
};

export const fetchCreatorsPostsAndSave = async (parentHash: string, tag: string) => {
  const data = await getCreatorsPosts(tag);

  const insertDetails = await creatorsPost.insertMany(data);

  const updatedData = await Bounty.findOneAndUpdate(
    { contract: parentHash },
    { $addToSet: { creatorsPosts: { $each: insertDetails.map((p) => p._id) } } }
  );

  return updatedData;
};
