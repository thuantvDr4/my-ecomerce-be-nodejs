const { BadRequestErrror } = require("../../../core/error.response");
const { furniture } = require("../../../models/product.model");
const ProductBase = require("../product.base");

class Furniture extends ProductBase {
  async createProduct() {
    const newItem = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newItem) throw new BadRequestErrror("Create new Furniture error!");

    const newProduct = await super.createProduct(newItem._id);
    if (!newProduct) throw new BadRequestErrror("Create new Product error!");

    return newProduct;
  }
}
module.exports = Furniture;
