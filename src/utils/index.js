"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateError = exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
const generateError = (err) => {
    if (err instanceof Error) {
        return err.message;
    }
    return "Unknown error";
};
exports.generateError = generateError;
