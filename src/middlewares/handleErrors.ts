import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

class BadRequestError extends Error {}

export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (
    err instanceof mongoose.Error.CastError ||
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.ValidatorError
  ) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      type: "mongo_error",
      message: err.message,
      stack: err.stack,
    });
  } else if (
    err instanceof mongoose.Error.DivergentArrayError ||
    err instanceof mongoose.Error.MissingSchemaError ||
    err instanceof mongoose.Error.DocumentNotFoundError ||
    err instanceof mongoose.Error.MongooseServerSelectionError ||
    err instanceof mongoose.Error.OverwriteModelError ||
    err instanceof mongoose.Error.ParallelSaveError ||
    err instanceof mongoose.Error.StrictModeError ||
    err instanceof mongoose.Error.VersionError
  ) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      type: "mongo_error",
      message: err.message,
      stack: err.stack,
    });
  } else if (err instanceof BadRequestError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      type: "application_error",
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      type: "application_error",
      message: err.message,
      stack: err.stack,
    });
  }

  console.error(err);
};
