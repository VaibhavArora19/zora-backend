import { Request, Response, NextFunction } from "express";
import bounty from "../models/bounty";
import randomstring from "randomstring";
import { postOnFarcaster } from "../tools/farcaster";
import { getActiveBounties, getAllBounties, getBountByKeyword } from "../services/bounties";

export const createBounty = async (req: Request, res: Response, next: NextFunction) => {
  const { link, isZora, splitAddress, budgetPercentage, campaignStartDate, campaignEndDate, keywords } = req.body;

  const uniqueKeyword = randomstring.generate(7);

  try {
    const newBounty = new bounty({
      link,
      isZora,
      uniqueKeyword,
      splitAddress,
      budgetPercentage,
      campaignStartDate,
      campaignEndDate,
      keywords,
    });

    const message = `Post: ${uniqueKeyword} \n\nNew bounty created for the token ${link} \n\nTrading fees percentage: ${budgetPercentage}% \n\nCampaign Start Date: ${campaignStartDate.toLocaleDateString()} \n\nCampaign End Date: ${campaignEndDate.toLocaleDateString()} \n\nKeywords: ${keywords.join(
      ", "
    )}`;
    await postOnFarcaster(message);

    await newBounty.save();
    res.status(201).json({ newBounty });
  } catch (error) {
    res.json({ error: "Error creating bounty" });
  }
};

export const getAllBountiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allBounties = await getAllBounties();

    res.status(200).json({ allBounties });
  } catch (error) {
    res.json({ error: "Error getting bounties" });
  }
};

export const getBountyByKeywordController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.params;

  try {
    const bountyByKeyword = await getBountByKeyword(keyword);

    res.status(200).json({ bountyByKeyword });
  } catch (error) {
    res.json({ error: "Error getting bounty" });
  }
};

export const getActiveBountiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeBounties = await getActiveBounties();

    res.status(200).json({ activeBounties });
  } catch (error) {
    res.json({ error: "Error getting active bounties" });
  }
};
