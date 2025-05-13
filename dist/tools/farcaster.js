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
exports.postOnFarcaster = exports.fetchByMention = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodejs_sdk_1 = require("@neynar/nodejs-sdk");
const fetchByMention = (limit, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Construct URL with query parameters
        const url = new URL("https://api.neynar.com/v2/farcaster/cast/search");
        url.searchParams.append("q", query);
        url.searchParams.append("limit", limit);
        // Make the API request
        const response = yield fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.API_KEY,
            },
        });
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        // Parse and return the JSON response
        return yield response.json();
    }
    catch (error) {
        console.error("Error searching casts:", error);
        throw error;
    }
});
exports.fetchByMention = fetchByMention;
const postOnFarcaster = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const neynarClient = new nodejs_sdk_1.NeynarAPIClient({
        apiKey: process.env.API_KEY,
    });
    const signerUuid = "27a08f94-a6a1-4180-8830-1635db9361df";
    neynarClient
        .publishCast({
        signerUuid,
        text: message,
    })
        .then((response) => {
        console.log("cast:", response.cast);
    });
});
exports.postOnFarcaster = postOnFarcaster;
