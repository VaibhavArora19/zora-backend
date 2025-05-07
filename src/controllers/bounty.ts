import { Request, Response, NextFunction } from "express";
import bounty from "../models/bounty";
import randomstring from "randomstring";

export const createBounty = async (req: Request, res: Response, next: NextFunction) => {
  const { zoraPostLink, budget, campaignStartDate, campaignEndDate, keywords } = req.body;

  const uniqueTag = randomstring.generate(9);

  const newBounty = new bounty({
    zoraPostLink,
    budget,
    uniqueTag,
    campaignStartDate,
    campaignEndDate,
    keywords,
  });

  await newBounty.save();

  res.json({ newBounty });
};
