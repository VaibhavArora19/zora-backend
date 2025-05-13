import { fetchByMention } from "../tools/farcaster";
import creatorsPost from "../models/creator-post";
import bounty from "../models/bounty";
import mongoose from "mongoose";
import { fetchSingleCoin } from "../tools/zora";

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
      post: cast.text,
      likes_count: cast.reactions.likes_count,
      recasts_count: cast.reactions.recasts_count,
      likes: cast.reactions.likes.fname,
      recasts: cast.reactions.recasts.fname,
      replies_count: cast?.replies?.count,
    });
  });

  return filteredData;
};

export const getCreatorsPostsZora = async (url: string) => {
  const match = url.match(/base:(0x[a-fA-F0-9]{40})/);

  const address = match ? match[1] : null;

  if (!address) return null;

  const coin = await fetchSingleCoin(address);

  if (!coin || !coin.data) return null;

  return {
    address: coin?.data?.zora20Token?.address,
    creatorAddress: coin?.data?.zora20Token?.creatorAddress,
    marketCap: coin?.data?.zora20Token?.marketCap,
    uniqueHolders: coin?.data?.zora20Token?.uniqueHolders,
    mediaContent: coin?.data?.zora20Token?.mediaContent,
    volume: coin?.data?.zora20Token?.totalVolume,
  };
};

//!this as of now inserts any post irrelevant of the date but need to make sure that it stores based on the date range
export const fetchCreatorsPostsAndSave = async (uniqueKeyword: string, parentHash: string) => {
  let data = await getCreatorsPosts(uniqueKeyword);
  //!but we want to filter it based on the date range as well and based on the post that it is meant for

  data = data.filter((post) => post.username !== "!1059812"); //do not pickup what bot has mentioned

  if (data.length === 0) return;

  const farcasterData = data.filter((post) => {
    return !post.post.includes("zora.co/coin/base");
  });

  const zoraData = data.filter((post) => {
    return post.post.includes("zora.co/coin/base");
  });

  const zoraInfo = [];
  const farcasterInfo = [];

  for (const zora of zoraData) {
    const coin = await getCreatorsPostsZora(zora.post);

    if (!coin) continue;

    const info = await creatorsPost.creatorPostZoraModel.findOneAndUpdate({ hash: zora.address }, { $set: zora }, { upsert: true, new: true });
    zoraInfo.push(info);
  }

  for (const farcaster of farcasterData) {
    const info = await creatorsPost.creatorPostFarcasterModel.findOneAndUpdate(
      { hash: farcaster.hash },
      { $set: farcaster },
      { upsert: true, new: true }
    );
    farcasterInfo.push(info);
  }

  const updatedData = await bounty.findOneAndUpdate(
    { link: parentHash },
    {
      $set: {
        creatorsPostsFarcaster: farcasterInfo.map((p) => new mongoose.Types.ObjectId(p._id)),
        creatorPostsZora: zoraInfo.map((a) => new mongoose.Types.ObjectId(a._id)),
      },
    },
    { new: true }
  );

  return updatedData;
};

export const getBountyInfoAndSaveCreator = async () => {
  const bountyInfo = await bounty.find({ isFinalized: false });

  if (!bountyInfo) {
    console.log("No bounty is exceeding deadline");
    return;
  }

  for (const bountyData of bountyInfo) {
    await fetchCreatorsPostsAndSave(bountyData.uniqueKeyword, bountyData.link);
  }
};
