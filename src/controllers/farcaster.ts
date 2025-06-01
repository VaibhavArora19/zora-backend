import { NextFunction, Request, Response } from "express";
import User from "../models/farcaster";

export const storeFid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fid } = req.body;
        await User.updateOne(
            { fid },     // query condition
            { $setOnInsert: { fid } },  // only set if inserting
            { upsert: true }
        );

        res.status(200).json({message: "Successfully updated"});
    } catch (error) {
        res.status(500).json({ message: "Failed to store fid"});
    }
}