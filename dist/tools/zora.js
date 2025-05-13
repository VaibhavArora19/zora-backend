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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSingleCoin = fetchSingleCoin;
const coins_sdk_1 = require("@zoralabs/coins-sdk");
const chains_1 = require("viem/chains");
function fetchSingleCoin(address) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const response = yield (0, coins_sdk_1.getCoin)({
            address,
            chain: chains_1.base.id, // Optional: Base chain set by default
        });
        const coin = (_a = response.data) === null || _a === void 0 ? void 0 : _a.zora20Token;
        if (coin) {
            console.log("Coin Details:");
            console.log("- Name:", coin.name);
            console.log("- Symbol:", coin.symbol);
            console.log("- Description:", coin.description);
            console.log("- Total Supply:", coin.totalSupply);
            console.log("- Market Cap:", coin.marketCap);
            console.log("- 24h Volume:", coin.volume24h);
            console.log("- Creator:", coin.creatorAddress);
            console.log("- Created At:", coin.createdAt);
            console.log("- Unique Holders:", coin.uniqueHolders);
            // Access media if available
            if ((_b = coin.mediaContent) === null || _b === void 0 ? void 0 : _b.previewImage) {
                console.log("- Preview Image:", coin.mediaContent.previewImage);
            }
        }
        return response;
    });
}
