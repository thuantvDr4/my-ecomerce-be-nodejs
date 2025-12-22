const { BadRequestErrror } = require("../../../core/error.response");
const { clothing } = require("../../../models/product.model");
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
}
module.exports = Clothing;
