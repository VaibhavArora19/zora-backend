import { Request, Response, NextFunction } from "express";
import Bounty from "../models/bounty";

export const createBounty = async (req: Request, res: Response, next: NextFunction) => {
  const { contract, title, metadata, bountyAmount, deadline } = req.body;

  const newBounty = new Bounty({
    contract: contract,
    title,
    bountyAmount,
    deadline,
    metadata,
  });

  await newBounty.save();

  res.json({ newBounty });
};
