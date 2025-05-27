import { Request, Response, NextFunction } from "express";
import bounty from "../models/bounty";
import randomstring from "randomstring";
import { postOnFarcaster } from "../tools/farcaster";
import {
  getActiveBounties,
  getAllBounties,
  getBountByKeyword,
  getBountyByAddress,
  getCompletedBounties,
  getUpcomingBounties,
} from "../services/bounties";

export const createBounty = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, creatorAddress, tokenId, link, isZora, splitAddress, budgetPercentage, campaignStartDate, campaignEndDate, keywords } =
    req.body;

  console.log("req.body: ", req.body);

  const uniqueKeyword = randomstring.generate(7);

  try {
    // Convert date strings to Date objects if needed
    const startDate = campaignStartDate instanceof Date ? campaignStartDate : new Date(campaignStartDate);
    const endDate = campaignEndDate instanceof Date ? campaignEndDate : new Date(campaignEndDate);

    // Updated message format to match what's expected by Farcaster
    const message = `Post: ${uniqueKeyword} \n\nNew bounty created for the token ${link} \n\nTitle: ${title} ${
      description ? `\n\nDescription: ${description}` : ""
    } \n\nBudget: ${budgetPercentage}% \n\nCampaign Start Date: ${startDate.toLocaleDateString()} \n\nCampaign End Date: ${endDate.toLocaleDateString()} \n\nKeywords: ${keywords.join(
      ", "
    )}`;

    const farcasterData = await postOnFarcaster(message);

    console.log("farcasterData: ", farcasterData);

    const newBounty = new bounty({
      title,
      description,
      creatorAddress,
      tokenId,
      link,
      isZora,
      uniqueKeyword,
      splitAddress,
      budgetPercentage,
      campaignStartDate: startDate,
      campaignEndDate: endDate,
      keywords,
      hash: farcasterData.cast.hash,
    });

    await newBounty.save();
    console.log("newBounty: ", newBounty);
    res.status(201).json(newBounty);
  } catch (error: any) {
    console.log("error: ", error);
    console.log("error.message: ", error.message);
    res.json({ error: "Error creating bounty" });
  }
};

export const getAllBountiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allBounties = await getAllBounties();

    res.status(200).json(allBounties);
  } catch (error) {
    res.json({ error: "Error getting bounties" });
  }
};

export const getBountyByKeywordController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.params;

  try {
    const bountyByKeyword = await getBountByKeyword(keyword);

    res.status(200).json(bountyByKeyword);
  } catch (error) {
    res.json({ error: "Error getting bounty" });
  }
};

export const getActiveBountiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeBounties = await getActiveBounties();

    res.status(200).json(activeBounties);
  } catch (error) {
    res.json({ error: "Error getting active bounties" });
  }
};

export const getUpcomingBountiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const upcomingBounties = await getUpcomingBounties();

    res.status(200).json(upcomingBounties);
  } catch (error) {
    res.json({ error: "Error getting upcoming bounties" });
  }
};

export const getCompletedBountiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const completedBounties = await getCompletedBounties();

    res.status(200).json(completedBounties);
  } catch (error) {
    res.json({ error: "Error getting completed bounties" });
  }
};

export const getBountyByAddressController = async (req: Request, res: Response, next: NextFunction) => {
  const { address } = req.params;

  try {
    const bountyByAddress = await getBountyByAddress(address);

    res.status(200).json(bountyByAddress);
  } catch (error) {
    res.json({ error: "Error getting bounty" });
  }
};

export const getBountyByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const bountyById = await bounty.findById(id);

    res.status(200).json(bountyById);
  } catch (error) {
    res.json({ error: "Error getting bounty" });
  }
};
