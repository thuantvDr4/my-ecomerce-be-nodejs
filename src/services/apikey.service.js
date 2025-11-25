// @ts-nocheck
"use strict";

const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findKeyById = async (key) => {
  const objectKey = await apikeyModel.findOne({ key, status: true }).lean();
  return objectKey;
};

const createNewKey = async () => {
  const newKey = await apikeyModel.create({
    key: crypto.randomBytes(64).toString("hex"),
    permissions: ["0000"],
  });
  return newKey;
};

module.exports = {
  findKeyById,
  createNewKey,
};
