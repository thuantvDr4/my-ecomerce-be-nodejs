"use strict";

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/**
 * key features
 * - add product to cart [user]
 * - reduce product quantity by on [user]
 * - increase product quantity by on [user]
 * - get cart by [user]
 * - delete cart [user]
 * - delete cart item [user]
 *
 */

class CartService {
  /// START REPO CART
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    //
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { new: true };

    const updated = await cart.findOneAndUpdate(query, updateSet, options);

    // 2. case sản pham cho có trong cart_products
    if (!updated) {
      const query = {
        cart_userId: userId,
        cart_state: "active",
      };
      const pushToSet = {
        $push: {
          cart_products: product,
        },
      };
      const options = { new: true, upsert: true };
      return await cart.findOneAndUpdate(query, pushToSet, options);
    }

    return updated;
  }

  static async checkProductOfShop(product = {}) {
    const { shopId, productId } = product;
    // check productId có tồn tại hay không?
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not exists");
    //compare shopId
    if (foundProduct.product_shop.toString() !== shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }
    return foundProduct;
  }
  ///================> END REPO CART

  // add product to cart
  static async addToCart({ userId, product = {} }) {
    // check cart có tồn tại hay chưa?
    const userCart = await cart.findOne({
      cart_userId: userId,
    });
    // check product
    const { product_name, product_price } =
      await CartService.checkProductOfShop(product);
    product = { ...product, name: product_name, price: product_price };

    if (!userCart) {
      // tao moi cart
      return await CartService.createUserCart({ userId, product });
    }
    //1. có cart nhưng cart_products = [] ->  insert vao sp
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    //2. neu cart tồn tại và có sản phẩm rồi -> update số lượng sp
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // update cart item
  /*
        shop_order_ids=[
            {
                shopId,
                item_products:[
                    {quantity, price, name, shopId, old_quantity, productId}
                ]
            }
        ]
    */
  static async updateToCartItem({ shop_order_ids = [], userId }) {
    const { shopId, item_products = [] } = shop_order_ids[0];
    const { productId, quantity, old_quantity } = item_products[0];

    // check productId có tồn tại hay không?
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not exists");
    //compare shopId
    if (foundProduct.product_shop.toString() !== shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      // delete item
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  //  delete item trong cart
  static async deleteUserCartItem({ userId, productId }) {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };
    const updateSet = {
      $pull: { cart_products: { productId } },
    };

    const deletedCart = await cart.updateOne(query, updateSet);
    return deletedCart;
  }

  // get list cart
  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: +userId }).lean();
  }
}
module.exports = CartService;
