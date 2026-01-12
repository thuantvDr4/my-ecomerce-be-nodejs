"use strict";
const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  // create code
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code generations",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  // get all codes
  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  // get discount amount
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  // get discount codes with products
  getAllDiscountCodesWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful code found",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };

  // delete

  // cancel
}

module.exports = new DiscountController();
