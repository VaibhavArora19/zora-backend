"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndDistribute = void 0;
const bounty_1 = __importDefault(require("../models/bounty"));
const calculate_score_1 = require("./calculate-score");
const checkAndDistribute = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const bountyInfo = (yield bounty_1.default
            .find({
            campaignEndDate: { $lt: new Date() },
            isFinalized: false,
        })
            .lean()
            .populate({
            path: "creatorsPostsFarcaster",
            model: "CreatorPostFarcaster",
            select: "address likes_count recasts_count replies_count followers following", // Only select fields we need
        })
            .populate({
            path: "creatorsPostsZora",
            model: "CreatorPostZora",
            select: "address marketCap uniqueHolders volume", // Only select fields we need
        })
            .exec());
        if (!bountyInfo || bountyInfo.length === 0) {
            return [];
        }
        for (const bountyData of bountyInfo) {
            const rewards = (0, calculate_score_1.calculateRewards)(bountyData.creatorsPostsFarcaster[0], bountyData.creatorsPostsZora[0]);
            //distribute rewards here
            yield bounty_1.default.findOneAndUpdate({ _id: bountyData._id }, { $set: { isFinalized: true } });
        }
    }
    catch (error) {
        console.error("Error in checkAndDistribute:", error);
        throw error;
    }
});
exports.checkAndDistribute = checkAndDistribute;
