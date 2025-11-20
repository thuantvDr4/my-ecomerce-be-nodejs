// @ts-nocheck

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenKeyPair } = require("../auth/authUtils");
const { format } = require("path");
const { getInfoData } = require("../utils");
const { BadRequestErrror } = require("../core/error.response");

const RoleShop = {
  SHOP: "0001",
  WRITER: "0002", //writer,
  EDITOR: "0003", //editor,
};

class AccessService {
  static async signup({ name, password, email }) {
    a;
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
        //--create token for login
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });
        console.log(":::", { privateKey, publicKey });

        const publicKeyStr = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        if (!publicKeyStr) {
          throw new BadRequestErrror("Error:Public key string error");
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyStr);
        console.log(":::publicKeyObject:", publicKeyObject);

        //-- create token pair
        const tokens = await createTokenKeyPair(
          { userId: newShop._id, email },
          publicKeyObject,
          privateKey
        );
        console.log("::create token success::", tokens);

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
