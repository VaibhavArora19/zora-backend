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
exports.createBounty = void 0;
const bounty_1 = __importDefault(require("../models/bounty"));
const randomstring_1 = __importDefault(require("randomstring"));
const farcaster_1 = require("../tools/farcaster");
const createBounty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, isZora, budget, campaignStartDate, campaignEndDate, keywords } = req.body;
    const uniqueKeyword = randomstring_1.default.generate(7);
    try {
        const newBounty = new bounty_1.default({
            link,
            isZora,
            uniqueKeyword,
            budget,
            campaignStartDate,
            campaignEndDate,
            keywords,
        });
        const message = `Post: ${uniqueKeyword} \n\nNew bounty created for the token ${link} \n\nBudget: ${budget} \n\nCampaign Start Date: ${campaignStartDate} \n\nCampaign End Date: ${campaignEndDate}. \n\nKeywords: ${keywords.join(", ")}`;
        yield (0, farcaster_1.postOnFarcaster)(message);
        yield newBounty.save();
        res.json({ newBounty });
    }
    catch (error) {
        res.json({ error: "Error creating bounty" });
    }
});
exports.createBounty = createBounty;
