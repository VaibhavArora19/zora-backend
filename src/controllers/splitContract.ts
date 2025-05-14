import { Request, Response, NextFunction } from "express";
import { SplitContractService } from "../services/splitContract";
import bounty from "../models/bounty";

const splitContractService = new SplitContractService();

export const updateSplit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { splitAddress, recipients, distributorFeePercent, totalAllocationPercent } = req.body;

    const response = await splitContractService.updateSplit({
      splitAddress: splitAddress as `0x${string}`,
      recipients,
      distributorFeePercent,
      totalAllocationPercent,
    });

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error updating split:", error);
    res.status(500).json({ error: "Error updating split" });
  }
};

export const distributeSplit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { splitAddress, tokenAddress, distributorAddress } = req.body;

    const response = await splitContractService.distributeSplit({
      splitAddress: splitAddress as `0x${string}`,
      tokenAddress: tokenAddress as `0x${string}`,
      distributorAddress: distributorAddress as `0x${string}`,
    });

    // Find and update the bounty with this split address
    const bountyDoc = await bounty.findOne({ splitAddress });
    if (bountyDoc) {
      bountyDoc.isFinalized = true;
      await bountyDoc.save();
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error("Error distributing split:", error);
    res.status(500).json({ error: "Error distributing split" });
  }
}; 