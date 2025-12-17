"use strict";

//!dmbg
const { Schema, model, Types } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMNENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";
const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = model(DOCUMNENT_NAME, shopSchema);
