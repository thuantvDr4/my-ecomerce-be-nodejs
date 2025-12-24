// @ts-nocheck
const { BadRequestErrror } = require("../../core/error.response");
const Clothing = require("./types/clothing.product");
const Electronics = require("./types/electronics.product");
const Furniture = require("./types/furniture.product");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishsForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
} = require("../../models/repositories/product.repo");

class ProductFactory {
  //--registry
  static productRegistry = {};
  static regisProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  // PUT
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestErrror(`Invalid Product Types ${type}!`);
    return new productClass(payload).createProduct();
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return unPublishProductByShop({ product_shop, product_id });
  }

  static async updateProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestErrror(`Invalid Product Types ${type}!`);
    return new productClass(payload).createProduct();
  }

  //--END PUT

  //--QUERY
  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({ keySearch });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return findAllPublishsForShop({ query, limit, skip });
  }

  static async findAllProducts({
    limit = 50,
    sort = "cTime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({
    limit = 50,
    sort = "cTime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }
}

//----------- excute registry
ProductFactory.regisProductType("Clothing", Clothing);
ProductFactory.regisProductType("Electronics", Electronics);
ProductFactory.regisProductType("Furniture", Furniture);
// ..... more type Product types

module.exports = ProductFactory;
