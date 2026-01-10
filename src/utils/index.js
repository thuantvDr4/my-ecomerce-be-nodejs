// @ts-nocheck
"use strict";
const _ = require("lodash");
const { Types } = require("mongoose");

const convertToOjectIdMongodb = (id) => {
  return Types.ObjectId(id);
};

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

const removeIsNil = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, removeIsNil(v)])
  );
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  console.log("::[updateNestedObjectParser - final]::", final);
  return final;
};

module.exports = {
  updateNestedObjectParser,
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeIsNil,
  convertToOjectIdMongodb,
};
