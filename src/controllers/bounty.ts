import { Request, Response, NextFunction } from "express";
import bounty from "../models/bounty";
import randomstring from "randomstring";
import { postOnFarcaster } from "../tools/farcaster";

export const createBounty = async (req: Request, res: Response, next: NextFunction) => {
  const { zoraPostLink, budget, campaignStartDate, campaignEndDate, keywords } = req.body;

  try {
    const newBounty = new bounty({
      zoraPostLink,
      budget,
      campaignStartDate,
      campaignEndDate,
      keywords,
    });

    const message = `New bounty created. \n\nCheck it out here: ${zoraPostLink} \n\nBudget: ${budget}. \n\nCampaign Start Date: ${campaignStartDate}. \n\nCampaign End Date: ${campaignEndDate}. Keywords: ${keywords.join(
      ", "
    )}`;
    await postOnFarcaster(message);

    await newBounty.save();
    res.json({ newBounty });
  } catch (error) {
    res.json({ error: "Error creating bounty" });
  }
};
