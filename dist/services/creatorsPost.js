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
exports.getBountyInfoAndSaveCreator = exports.fetchCreatorsPostsAndSave = exports.getCreatorsPostsZora = exports.getCreatorsPosts = void 0;
const farcaster_1 = require("../tools/farcaster");
const creator_post_1 = __importDefault(require("../models/creator-post"));
const bounty_1 = __importDefault(require("../models/bounty"));
const mongoose_1 = __importDefault(require("mongoose"));
const zora_1 = require("../tools/zora");
const getCreatorsPosts = (tag) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, farcaster_1.fetchByMention)("20", tag);
    const filteredData = [];
    if (response.result.casts.length === 0)
        return [];
    response.result.casts.filter((cast) => {
        var _a;
        filteredData.push({
            hash: cast.hash,
            username: cast.author.username,
            display_name: cast.author.display_name,
            pfp_url: cast.author.pfp_url,
            followers: cast.author.follower_count,
            following: cast.author.following_count,
            address: cast.author.custody_address,
            post: cast.text,
            likes_count: cast.reactions.likes_count,
            recasts_count: cast.reactions.recasts_count,
            likes: cast.reactions.likes.fname,
            recasts: cast.reactions.recasts.fname,
            replies_count: (_a = cast === null || cast === void 0 ? void 0 : cast.replies) === null || _a === void 0 ? void 0 : _a.count,
        });
    });
    return filteredData;
});
exports.getCreatorsPosts = getCreatorsPosts;
const getCreatorsPostsZora = (url) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const match = url.match(/base:(0x[a-fA-F0-9]{40})/);
    const address = match ? match[1] : null;
    if (!address)
        return null;
    const coin = yield (0, zora_1.fetchSingleCoin)(address);
    if (!coin || !coin.data)
        return null;
    return {
        address: (_b = (_a = coin === null || coin === void 0 ? void 0 : coin.data) === null || _a === void 0 ? void 0 : _a.zora20Token) === null || _b === void 0 ? void 0 : _b.address,
        creatorAddress: (_d = (_c = coin === null || coin === void 0 ? void 0 : coin.data) === null || _c === void 0 ? void 0 : _c.zora20Token) === null || _d === void 0 ? void 0 : _d.creatorAddress,
        marketCap: (_f = (_e = coin === null || coin === void 0 ? void 0 : coin.data) === null || _e === void 0 ? void 0 : _e.zora20Token) === null || _f === void 0 ? void 0 : _f.marketCap,
        uniqueHolders: (_h = (_g = coin === null || coin === void 0 ? void 0 : coin.data) === null || _g === void 0 ? void 0 : _g.zora20Token) === null || _h === void 0 ? void 0 : _h.uniqueHolders,
        mediaContent: (_k = (_j = coin === null || coin === void 0 ? void 0 : coin.data) === null || _j === void 0 ? void 0 : _j.zora20Token) === null || _k === void 0 ? void 0 : _k.mediaContent,
        volume: (_m = (_l = coin === null || coin === void 0 ? void 0 : coin.data) === null || _l === void 0 ? void 0 : _l.zora20Token) === null || _m === void 0 ? void 0 : _m.totalVolume,
    };
});
exports.getCreatorsPostsZora = getCreatorsPostsZora;
//!this as of now inserts any post irrelevant of the date but need to make sure that it stores based on the date range
const fetchCreatorsPostsAndSave = (uniqueKeyword, parentHash) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield (0, exports.getCreatorsPosts)(uniqueKeyword);
    //!but we want to filter it based on the date range as well and based on the post that it is meant for
    data = data.filter((post) => post.username !== "!1059812"); //do not pickup what bot has mentioned
    if (data.length === 0)
        return;
    const farcasterData = data.filter((post) => {
        return !post.post.includes("zora.co/coin/base");
    });
    const zoraData = data.filter((post) => {
        return post.post.includes("zora.co/coin/base");
    });
    const zoraInfo = [];
    const farcasterInfo = [];
    for (const zora of zoraData) {
        const coin = yield (0, exports.getCreatorsPostsZora)(zora.post);
        if (!coin)
            continue;
        const info = yield creator_post_1.default.creatorPostZoraModel.findOneAndUpdate({ hash: zora.address }, { $set: zora }, { upsert: true, new: true });
        zoraInfo.push(info);
    }
    for (const farcaster of farcasterData) {
        const info = yield creator_post_1.default.creatorPostFarcasterModel.findOneAndUpdate({ hash: farcaster.hash }, { $set: farcaster }, { upsert: true, new: true });
        farcasterInfo.push(info);
    }
    const updatedData = yield bounty_1.default.findOneAndUpdate({ link: parentHash }, {
        $set: {
            creatorsPostsFarcaster: farcasterInfo.map((p) => new mongoose_1.default.Types.ObjectId(p._id)),
            creatorPostsZora: zoraInfo.map((a) => new mongoose_1.default.Types.ObjectId(a._id)),
        },
    }, { new: true });
    return updatedData;
});
exports.fetchCreatorsPostsAndSave = fetchCreatorsPostsAndSave;
const getBountyInfoAndSaveCreator = () => __awaiter(void 0, void 0, void 0, function* () {
    const bountyInfo = yield bounty_1.default.find({ isFinalized: false });
    if (!bountyInfo) {
        console.log("No bounty is exceeding deadline");
        return;
    }
    for (const bountyData of bountyInfo) {
        yield (0, exports.fetchCreatorsPostsAndSave)(bountyData.uniqueKeyword, bountyData.link);
    }
});
exports.getBountyInfoAndSaveCreator = getBountyInfoAndSaveCreator;
