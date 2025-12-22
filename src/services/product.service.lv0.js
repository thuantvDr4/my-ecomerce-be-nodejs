// @ts-nocheck
"use strict";
const { product, clothing, electronic } = require("../models/product.model");
const { BadRequestErrror, ForbiddenError } = require("../core/error.response");

class ProductFactory {
  /**
   * type: clothing | electronic
   */

  static productRegistry = {};

  static regisProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestErrror(`Invalid Product Types ${type}!`);
    return new productClass(payload).createProduct();
  }
}

//---> define base product
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_attributes,
    product_shop,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_shop = product_shop;
  }
  // create new product
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// define sub-class for difference type

//--clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestErrror("Create new Clothing error!");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestErrror("Create new Prouct error!");

    return newProduct;
  }
}

//--Electronics
class Electronics extends Product {
  async createProduct() {
    const newItem = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newItem) throw new BadRequestErrror("Create new Electronic error!");

    const newProduct = await super.createProduct(newItem._id);
    if (!newProduct) throw new BadRequestErrror("Create new Prouct error!");

    return newProduct;
  }
}

module.exports = ProductFactory;
