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
    return await keytokenModel.findOne({ user: userId });
  }

  static async removeKeyById(id) {
    return await keytokenModel.deleteOne(id);
  }

  static async findByRefreshToken(refreshToken) {
    return await keytokenModel.findOne({ refreshToken: refreshToken }); // dung luon ham update
  }

  static async findByRefreshTokenUsed(refreshToken) {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  }

  static async deleteKeyById(userId) {
    return await keytokenModel.deleteOne({ user: userId });
  }
}

module.exports = KeyTokenService;
