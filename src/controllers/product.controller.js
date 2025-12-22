// @ts-nocheck
"use strict";
const { SuccessResponse } = require("../core/success.response");
// const ProductService = require("../services/product.service");
const ProductService = require("../services/products/product.service");

class ProductController {
  async createproduct(req, res, next) {
    new SuccessResponse({
      message: "Create product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  async pudlishProductByShop(req, res, next) {
    new SuccessResponse({
      message: "pudlishProductByShop success!",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  }

  //--QUERY

  /**
   * @desc get all drafts for shop
   * @param {Nmber} limit
   * @param {String} product_shop
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllDraftsForShop(req, res, next) {
    new SuccessResponse({
      message: "getAllDraftsForShop success!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  //--getAllDraftsForShop
  async getAllPublishForShop(req, res, next) {
    new SuccessResponse({
      message: "getAllPublishForShop success!",
      metadata: await ProductService.findAllPublishsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  }
  // --END QUERY
}

module.exports = new ProductController();
