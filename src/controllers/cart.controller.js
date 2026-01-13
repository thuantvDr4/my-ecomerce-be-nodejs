"use strict";
const { SuccessResponse } = require("../core/success.response");
const cartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    //new
    new SuccessResponse({
      message: "Create new cart success",
      metadata: await cartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    // update
    new SuccessResponse({
      message: "update cart success",
      metadata: await cartService.updateToCartItem(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    //delete
    new SuccessResponse({
      message: "delete cart item success",
      metadata: await cartService.deleteUserCartItem(req.body),
    }).send(res);
  };

  getList = async (req, res, next) => {
    //get list
    new SuccessResponse({
      message: "get list cart success",
      metadata: await cartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
