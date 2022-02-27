"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../utils/index");
const User_1 = require("../models/User");
exports.authRoutes = express_1.default.Router();
exports.authRoutes.route("/login").post((0, index_1.asyncHandler)(async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error("Username and password required!");
        }
        const user = await User_1.UserModel.findOne({ username });
        if (user && (await bcrypt_1.default.compare(password, user.password))) {
            const token = jsonwebtoken_1.default.sign({ user_id: user._id, username }, process.env.TOKEN_KEY, {
                expiresIn: "2h",
            });
            user.token = token;
            res.status(200).json(user);
        }
        else {
            throw new Error("Password is incorrect!");
        }
    }
    catch (err) {
        res.status(400).send((0, index_1.generateError)(err));
    }
}));
exports.authRoutes.route("/register").post((0, index_1.asyncHandler)(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            throw new Error("All fields must be provided!");
        }
        const existingUser = await User_1.UserModel.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists!");
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const user = await User_1.UserModel.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_KEY, {
            expiresIn: "2h",
        });
        user.token = token;
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).send((0, index_1.generateError)(err));
    }
}));
