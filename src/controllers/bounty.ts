import { Request, Response, NextFunction } from "express";
import bounty from "../models/bounty";
import randomstring from "randomstring";
import { postOnFarcaster } from "../tools/farcaster";

export const createBounty = async (req: Request, res: Response, next: NextFunction) => {
  const { link, isZora, budgetPercentage, campaignStartDate, campaignEndDate, keywords } = req.body;

  const uniqueKeyword = randomstring.generate(7);

  try {
    const newBounty = new bounty({
      link,
      isZora,
      uniqueKeyword,
      budgetPercentage,
      campaignStartDate,
      campaignEndDate,
      keywords,
    });

    const message = `Post: ${uniqueKeyword} \n\nNew bounty created for the token ${link} \n\nTrading fees percentage: ${budgetPercentage}% \n\nCampaign Start Date: ${campaignStartDate.toLocaleString()} \n\nCampaign End Date: ${campaignEndDate.toLocaleString()}. \n\nKeywords: ${keywords.join(
      ", "
    )}`;
    await postOnFarcaster(message);

    await newBounty.save();
    res.status(201).json({ newBounty });
  } catch (error) {
    res.json({ error: "Error creating bounty" });
  }
};
