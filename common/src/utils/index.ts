import { NextFunction, Request, Response } from "express";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const generateError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  return "Unknown error";
};

export const verifyEmail = (email: any) => {
  const emailRegex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  console.log(email);
  console.log(typeof email);

  if (!email) return false;

  if (typeof email !== "string") {
    return false;
  }

  if (email.length > 254) return false;

  const valid = emailRegex.test(email);

  if (!valid) return false;

  // Further checking of some things regex can't handle
  const parts: string[] = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");
  if (domainParts.some(part => part.length > 63)) return false;

  return true;
};
