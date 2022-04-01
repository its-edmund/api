// @ts-ignore
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Hashids from "hashids";
import { UserModel } from "../models/User";

const hashids = new Hashids();

// CACHES
const intermediateTokenCache: { [key: string]: [id: string, origin: string] } = {};
const sessionApp: { [id: string]: { [key: string]: boolean } } = {};

const allowedOrigin: { [key: string]: boolean } = {
  "https://blog.edmundxin.me": true,
};

const originAppName: { [key: string]: string } = {
  "https://blog.edmundxin.me": "blog",
};

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, "");
const encodedId = () => hashids.encodeHex(deHyphenatedUUID());

const filleIntermediateTokenCache = (origin: string, id: string, intermediateToken: string) => {
  intermediateTokenCache[intermediateToken] = [id, originAppName[origin]];
};

const storeApplicationInCache = (origin: string, id: string, intermediateToken: string) => {
  if (sessionApp[id] === null) {
    sessionApp[id] = {
      [originAppName[origin]]: true,
    };
    filleIntermediateTokenCache(origin, id, intermediateToken);
  } else {
    sessionApp[id][originAppName[origin]] = true;
  }
};

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

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const redirectURL = `${req.protocol}://${req.headers.host}${req.path}`;
  console.log(req.session.user);

  if (!req.session.user) {
    return res.redirect(
      `${
        process.env.NODE_ENV === "production" ? "https://api.edmundxin.me" : "http://localhost:8000"
      }/sso/login?serviceURL=${redirectURL}`
    );
  }
  next();
};

export const doLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  // TODO: hash password
  const hashedPassword = "";
  if (!user || user.password !== hashedPassword) {
    return res.status(404).json({ message: "Invalid email and password" });
  }

  const { serviceURL } = req.query;
  const id = encodedId();
  req.session.user = id;
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { serviceURL } = req.query;

  if (serviceURL !== null) {
    const url = new URL(serviceURL as string);
    if (allowedOrigin[url.origin] !== true) {
      return res.status(400).json({ message: "You're not allowed to access the sso-server!" });
    }
  }

  if (req.session.user !== null && serviceURL === null) {
    return res.redirect("/");
  }

  if (req.session.user && serviceURL !== null) {
    const url = new URL(serviceURL as string);
    const intermediate = encodedId();
    storeApplicationInCache(url.origin, req.session.user, intermediate);
    return res.redirect(`${serviceURL}?ssoToken=${intermediate}`);
  }

  return res.render("login", {
    title: "SSO-Server | Login",
  });
};
