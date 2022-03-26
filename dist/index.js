"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_controller_1 = __importDefault(require("./user.controller"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/user', user_controller_1.default);
mongoose_1.default.connect('mongodb://' + process.env.MONGO_URL, {}, () => {
    console.log('Conected to database.');
});
app.listen(process.env.PORT, () => {
    console.log(`⚡️ Server is running at https://localhost:${process.env.PORT}`);
});
