const { BadRequestErrror } = require("../../../core/error.response");
const { furniture } = require("../../../models/product.model");
const {
  updateProductById,
} = require("../../../models/repositories/product.repo");
const { removeIsNil, updateNestedObjectParser } = require("../../../utils");
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

  async updateProduct(product_id) {
    const objParams = removeIsNil(this);

    if (objParams?.product_attributes) {
      // update child
      await updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objParams.product_attributes),
        model: furniture,
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
module.exports = Furniture;
