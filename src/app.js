"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
mongoose_1.default.connect("mongodb://localhost:27017/acmedb").catch(err => {
    throw err;
});
exports.app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(body_parser_1.default.json());
exports.app.get("/status", (req, res) => {
    res.status(200).end("Authentication service is running!");
});
exports.app.use("/", routes_1.defaultRouter);
exports.app.listen(PORT, () => {
    console.log(`Authentication service started on port ${PORT}`);
});
