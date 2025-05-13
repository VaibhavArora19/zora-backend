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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const bounty_1 = __importDefault(require("./routes/bounty"));
const node_cron_1 = __importDefault(require("node-cron"));
const creatorsPost_1 = require("./services/creatorsPost");
const check_and_distribute_1 = require("./services/check-and-distribute");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(bounty_1.default);
node_cron_1.default.schedule("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, creatorsPost_1.getBountyInfoAndSaveCreator)();
    // after calling this function, sleep here for 10 minutes before the formula call
    setTimeout(() => {
        (0, check_and_distribute_1.checkAndDistribute)();
    }, 10 * 60 * 1000);
}));
mongoose_1.default.connect(process.env.DATABASE_URL);
app.listen(8000, () => {
    console.log("Server started at 8000");
});
