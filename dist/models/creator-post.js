"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const creatorPostFarcasterSchema = new mongoose_1.Schema({
    hash: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    display_name: { type: String, required: true },
    pfp_url: { type: String, required: true },
    followers: { type: Number, required: true },
    following: { type: Number, required: true },
    address: { type: String, required: true },
    likes_count: { type: Number, required: true },
    recasts_count: { type: Number, required: true },
    post: { type: String, required: true },
    likes: { type: [String] },
    recasts: { type: [String] },
    replies_count: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
});
const creatorPostZoraSchema = new mongoose_1.Schema({
    address: { type: String, required: true, unique: true },
    creatorAddress: { type: String, required: true },
    marketCap: { type: Number, required: true },
    uniqueHolders: { type: Number, required: true },
    mediaContent: { type: [String] },
    volume: { type: Number, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
});
const creatorPostFarcasterModel = mongoose_1.default.model("CreatorPostFarcaster", creatorPostFarcasterSchema);
const creatorPostZoraModel = mongoose_1.default.model("CreatorPostZora", creatorPostZoraSchema);
exports.default = { creatorPostFarcasterModel, creatorPostZoraModel };
