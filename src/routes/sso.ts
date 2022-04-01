import express from "express";
import { UserModel } from "../models/User";
import { asyncHandler } from "../utils";
import Hashids from "hashids/cjs/hashids";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const hashids = new Hashids();

export const ssoRoutes = express.Router();

// CACHES
const intermediateTokenCache: { [key: string]: [id: string, origin: string] } = {};
const sessionUser: { [id: string]: string } = {};
const sessionApp: { [id: string]: { [key: string]: boolean } } = {};

const allowedOrigin: { [key: string]: boolean } = {
  "https://blog.edmundxin.me": true,
  "http://localhost:8000": true,
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
  if (!sessionApp[id]) {
    sessionApp[id] = {
      [originAppName[origin]]: true,
    };
    filleIntermediateTokenCache(origin, id, intermediateToken);
  } else {
    sessionApp[id][originAppName[origin]] = true;
  }
};

ssoRoutes.route("/login").post(
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    // TODO: hash password
    const hashedPassword = "";
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({ message: "Invalid email and password" });
    }

    const { serviceURL } = req.query;
    const id = encodedId();
    req.session.user = id;
    sessionUser[id] = username;
    if (!serviceURL) {
      return res.redirect("/");
    }
    const url = new URL(serviceURL as string);
    const intermediate = encodedId();
    storeApplicationInCache(url.origin, id, intermediate);
    return res.redirect(`${serviceURL}?ssoToken=${intermediate}`);
  })
);

ssoRoutes.route("/login").get(
  asyncHandler(async (req, res) => {
    const { serviceURL } = req.query;

    if (serviceURL !== null) {
      const url = new URL(serviceURL as string);
      console.log(url.origin);
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
  })
);
