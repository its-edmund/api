import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Missing token for authorization!");
  }

  try {
    jwt.verify(token, process.env.TOKEN_KEY!);
  } catch (err) {
    return res.status(401).send("Invalid token!");
  }

  return next();
};
