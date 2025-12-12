// @ts-nocheck
"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const HEADER = require("../constant/headerKeys");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const createTokenKeyPair = async (payload, { publicKey, privateKey }) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
      // algorithm: "RS256", // dùng cho key dạng chuẩn PEM
      algorithm: "HS256",
    });

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
      // algorithm: "RS256", // dùng cho key dạng chuẩn PEM
      algorithm: "HS256",
    });

    // verify token
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("::JWT:verify:Error", err);
      } else {
        console.log("::decode:: verify::", decode);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1. check userId in headers
   * 2. get accessToken
   * 3. verify token
   * 4. check user in dbs
   * 5. check keystore
   * 6. return next()
   */

  //1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");
  //2.
  const keyStore = await findByUserId(userId);
  console.log(":::keystore::", keyStore);
  if (!keyStore) throw new NotFoundError("Not found key store");

  //3.
  const accessToken = req?.headers[HEADER.AUTHORIZATION];
  if (!accessToken)
    throw new AuthFailureError("Invalid request,not found accessToken");
  try {
    const decodeUser = await JWT.verify(accessToken, keyStore?.publicKey);
    console.log("::decode user::", decodeUser);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;

    // 6.
    return next();
  } catch (error) {
    console.log("::decode error::", error);
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  verifyJWT,
  authentication,
  createTokenKeyPair,
};
