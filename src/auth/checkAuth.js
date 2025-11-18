// @ts-nocheck
"use strict";
const { findKeyById, createNewKey } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req?.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    //-demo-example create new key
    // const newkey = await createNewKey();
    // console.log("--:::api-key::", newkey);

    // check key in db
    const objKey = await findKeyById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error...",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission = "") => {
  return (req, res, next) => {
    const permissions = req?.objKey?.permissions || [];
    if (!permissions) {
      return res.status(403).json({ message: "Permission denied" });
    }
    const validPermision = permissions?.includes(permission);
    if (!validPermision) {
      return res.status(403).json({ message: "Permission denied" });
    }
    return next();
  };
};

module.exports = {
  permission,
  apiKey,
};
