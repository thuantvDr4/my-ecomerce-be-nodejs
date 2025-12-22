const { BadRequestErrror } = require("../../../core/error.response");
const { electronic } = require("../../../models/product.model");
const ProductBase = require("../product.base");

class Electronics extends ProductBase {
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

module.exports = Electronics;
