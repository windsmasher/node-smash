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
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("./models/user.model"));
const validation_middleware_1 = __importDefault(require("./middleware/validation.middleware"));
const timestamp_middleware_1 = __importDefault(require("./middleware/timestamp.middleware"));
const user_dto_1 = __importDefault(require("./dtos/user.dto"));
const bcrypt = require('bcrypt');
const controller = express_1.default.Router();
controller.use((0, timestamp_middleware_1.default)());
controller.post('/register', (0, validation_middleware_1.default)(user_dto_1.default), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.find({ email: req.body.email });
    if (existingUser.length !== 0) {
        return next(new Error('User exists.'));
    }
    const salt = yield bcrypt.genSalt(10);
    const hashedPwd = yield bcrypt.hash(req.body.password, salt);
    const user = new user_model_1.default({
        email: req.body.email,
        password: hashedPwd,
    });
    yield user.save();
    res.send(user);
}));
controller.post('/login', (req, res) => { });
exports.default = controller;
