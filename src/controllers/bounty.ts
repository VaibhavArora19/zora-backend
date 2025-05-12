import { Request, Response, NextFunction } from "express";
import bounty from "../models/bounty";
import randomstring from "randomstring";
import { postOnFarcaster } from "../tools/farcaster";

export const createBounty = async (req: Request, res: Response, next: NextFunction) => {
  const { link, isZora, budget, campaignStartDate, campaignEndDate, keywords } = req.body;

  const uniqueKeyword = randomstring.generate(7);

  try {
    const newBounty = new bounty({
      link,
      isZora,
      uniqueKeyword,
      budget,
      campaignStartDate,
      campaignEndDate,
      keywords,
    });

    const message = `Post: ${uniqueKeyword} \n\nNew bounty created for the token ${link} \n\nBudget: ${budget}. \n\nCampaign Start Date: ${campaignStartDate}. \n\nCampaign End Date: ${campaignEndDate}. Keywords: ${keywords.join(
      ", "
    )}`;
    await postOnFarcaster(message);

    await newBounty.save();
    res.json({ newBounty });
  } catch (error) {
    res.json({ error: "Error creating bounty" });
  }
};
