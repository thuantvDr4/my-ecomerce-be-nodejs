// @ts-nocheck
"use strict";
const JWT = require("jsonwebtoken");

const createTokenKeyPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: "2 days",
      algorithm: "RS256",
    });

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
      algorithm: "RS256",
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

module.exports = {
  createTokenKeyPair,
};
