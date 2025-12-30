// @ts-nocheck
const { BadRequestErrror } = require("../../../core/error.response");
const { clothing } = require("../../../models/product.model");
const {
  updateProductById,
} = require("../../../models/repositories/product.repo");
const { removeIsNil, updateNestedObjectParser } = require("../../../utils");
const ProductBase = require("../product.base");

class Clothing extends ProductBase {
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

  async updateProduct(product_id) {
    const objParams = removeIsNil(this);

    if (objParams?.product_attributes) {
      // update child
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objParams.product_attributes),
        model: clothing,
      });
    }
    // update product
    const _updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(objParams)
    );
    return _updateProduct;
  }
}
module.exports = Clothing;
