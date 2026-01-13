"use strict";

const { model, Schema } = require("mongoose");

const DOCUMNENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "createOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  cart: model(DOCUMNENT_NAME, cartSchema),
};
