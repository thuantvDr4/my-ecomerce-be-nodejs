// @ts-nocheck
"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static async createKeyToken({ userId, publicKey }) {
    try {
      const publicKeyStr = publicKey.toString();
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey: publicKeyStr,
      });
      return tokens ? tokens?.publicKey : null;
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
