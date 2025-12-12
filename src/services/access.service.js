// @ts-nocheck
"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenKeyPair, verifyJWT } = require("../auth/authUtils");
const { format } = require("path");
const { getInfoData } = require("../utils");
const {
  BadRequestErrror,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const {
  generateKeys,
  generateKeyByRandomBytes,
} = require("../helpers/crypto.helper");

const RoleShop = {
  SHOP: "0001",
  WRITER: "0002", //writer,
  EDITOR: "0003", //editor,
};

class AccessService {
  //--check refresh token
  /**
   * check refreshtoken is used?
   */
  static async handleRefreshToken(refreshToken) {
    // check xem token nay da duoc su dung chua?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // neu co
    if (foundToken) {
      // decode xem may là thang nao?
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log(":::", { userId, email });
      //--xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Somethings wrong happen! Please relogin");
    }
    // NO
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registed! 1");
    // verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    // check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registed! 2");

    // cap lại 1 cap token moi
    const tokens = await createTokenKeyPair(
      { email, userId },
      {
        publicKey: holderToken.publicKey,
        privateKey: holderToken.privateKey,
      }
    );
    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // da duoc su dung de lay token moi roi
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  }

  //--logout
  static async logout(keyStore) {
    console.log("::keysotr", keyStore);
    const delkey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("::delKey::", delkey);
    return delkey;
  }

  //--login
  /**
   * 1. check email
   * 2. match password
   * 3. create access token & refresh token -> save db
   * 4. general tokens
   * 5. get data return login
   */
  static async login({ email, password, refreshToken = null }) {
    //1.
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestErrror("Shop not registered");

    //2.
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");
    //3.
    const privateKey = generateKeyByRandomBytes();
    const publicKey = generateKeyByRandomBytes();
    const userId = foundShop._id;

    //4.1
    const tokens = await createTokenKeyPair(
      { userId, email },
      {
        publicKey,
        privateKey,
      }
    );
    //4.2 save db
    await KeyTokenService.createKeyToken({
      userId,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });
    //5.
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  }

  //--signup
  static async signup({ name, password, email }) {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestErrror("Error:Shop already!");
      }
      const passHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        roles: [RoleShop.SHOP],
        password: passHash,
      });

      if (newShop) {
        //--create token for login HIGHT LEVEL
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });
        // console.log(":::", { privateKey, publicKey });

        // const publicKeyStr = await KeyTokenService.createKeyToken({
        //   userId: newShop._id,
        //   publicKey,
        // });
        // if (!publicKeyStr) {
        //   throw new BadRequestErrror("Error:Public key string error");
        // }

        // const publicKeyObject = crypto.createPublicKey(publicKeyStr);
        // console.log(":::publicKeyObject:", publicKeyObject);

        // //-- create token pair
        // const tokens = await createTokenKeyPair(
        //   { userId: newShop._id, email },
        //   publicKeyObject,
        //   privateKey
        // );
        // console.log("::create token success::", tokens);

        //----FOR MEDIUM LEVEL
        const privateKey = generateKeyByRandomBytes();
        const publicKey = generateKeyByRandomBytes();
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) throw new BadRequestErrror("Error:Key store error");

        //-- create token pair
        const tokens = await createTokenKeyPair(
          { userId: newShop._id, email },
          {
            publicKey,
            privateKey,
          }
        );
        console.log("::create token success::", tokens);

        if (!tokens) throw new BadRequestErrror("Error:Tokens create error");

        return {
          code: 2001,
          metadta: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      throw new BadRequestErrror(error?.message);
    }
  }
}

module.exports = AccessService;
