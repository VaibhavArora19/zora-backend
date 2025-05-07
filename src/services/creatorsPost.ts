import { fetchByMention } from "../tools/farcaster";
import creatorsPost from "../models/creator-post";
import bounty from "../models/bounty";
import { IBounty } from "../types/bounty";
import mongoose from "mongoose";

export const getCreatorsPosts = async (tag: string) => {
  const response = await fetchByMention("20", tag);

  const filteredData: any[] = [];

  if (response.result.casts.length === 0) return [];

  response.result.casts.filter((cast: any) => {
    filteredData.push({
      hash: cast.hash,
      username: cast.author.username,
      display_name: cast.author.display_name,
      pfp_url: cast.author.pfp_url,
      followers: cast.author.follower_count,
      following: cast.author.following_count,
      address: cast.author.custody_address,
      post: cast.author.text,
      likes_count: cast.reactions.likes_count,
      recasts_count: cast.reactions.recasts_count,
      likes: cast.reactions.likes.fname,
      recasts: cast.reactions.recasts.fname,
      replies_count: cast.reactions?.replies?.count,
    });
  });

  return filteredData;
};

//!this as of now inserts any post irrelevant of the date but need to make sure that it stores based on the date range
export const fetchCreatorsPostsAndSave = async (parentHash: string, tag: string) => {
  const data = await getCreatorsPosts(tag);

  if (data.length === 0) return;

  const insertDetails = await creatorsPost.insertMany(data);

  const updatedData = await bounty.findOneAndUpdate(
    { zoraPostLink: parentHash },
    {
      $set: {
        creatorsPosts: insertDetails.map((p) => new mongoose.Types.ObjectId(p._id)),
      },
    },
    { new: true }
  );

  return updatedData;
};

export const getBountyInfoAndSaveCreator = async () => {
  const bountyInfo = (await bounty.find({ deadline: { $lt: new Date() }, isFinalized: false })) as IBounty[];

  if (!bountyInfo) return;

  bountyInfo.forEach(async (bounty) => {
    await fetchCreatorsPostsAndSave(bounty.zoraPostLink, bounty.uniqueTag);
  });
};
