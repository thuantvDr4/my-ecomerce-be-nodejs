"use strict";

const { BadRequestErrror, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findDiscount,
  findAllDiscountCodesUnselect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToOjectIdMongodb } = require("../utils");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
    } = payload;

    // kiem tra
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestErrror("Discount code has expired!");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestErrror("start_date must be before end_date");
    }

    //create index for discount code
    const foundDiscount = await findDiscount({
      discount_code: code,
      discount_shopId: convertToOjectIdMongodb(shopId),
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestErrror("Discount exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to == "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  //--update
  static async updateDiscountCod() {}

  // get all discount codes available with products
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    //find discount
    const foundDiscount = await findDiscount({
      discount_code: code,
      discount_shopId: convertToOjectIdMongodb(shopId),
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      //get all products
      products = await findAllProducts({
        filter: {
          product_shop: convertToOjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  //--get all discount codes of shop
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnselect({
      model: discount,
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToOjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
    });

    return discounts;
  }

  /*
    apply discount code
    prodcuts =[
     {
       productId,
       shopId,
       quantity,
       name,
       price
    },
      {
       productId,
      shopId,
       quantity,
       name,
       price
    },
    ]
   */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToOjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exists!`);

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError(`discount expired!`);
    if (!discount_max_uses) throw new NotFoundError(`discount are out!`);

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("dicsount has code is expired!");
    }
    // check xem có set gia tri toi thieu hay khong?
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `discount requires a minimum order value of ${discount_min_order_value}`
        );
      }
    }
    // check so lan su dung tren userId
    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUsedDiscount) {
        //...neu so lan
      }
    }

    // discount này là fixed amount hay percent
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    // RETURN
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  /*
  delete discount
  cach chuẩn là: 1: kiểm tra có discount không? -> 2: lưu vào 1 database khác để truy van history sau này
  -> 3: xóa
  */
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToOjectIdMongodb(shopId),
    });
    return deleted;
  }

  /*
    cancel discount
  */
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToOjectIdMongodb(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError(`discount doesn't exists!`);

    const result = await discount.findByIdAndUpdate({
      $pull: { discount_users_used: userId },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }

  // END
}

module.exports = DiscountService;
