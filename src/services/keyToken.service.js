// @ts-nocheck
"use strict";

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      //  return tokens ? tokens?.publicKey : null;

      // level xx
      const filter = { user: userId };
      const update = {
        privateKey,
        publicKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens?.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static async findByUserId(userId) {
    if (!Types.ObjectId.isValid(userId)) return null;
    return await keytokenModel.findOne({ user: userId }).lean();
  }

  static async removeKeyById(id) {
    return await keytokenModel.deleteOne(id);
  }
}

module.exports = KeyTokenService;
