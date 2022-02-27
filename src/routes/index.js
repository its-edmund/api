"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
exports.defaultRouter = express_1.default.Router();
exports.defaultRouter.use("/", auth_1.authRoutes);
