"use strict";
const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

//--check authentication
router.use(authenticationV2);
//----/////
router.post("", asyncHandler(productController.createproduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.pudlishProductByShop)
);

//--QUERY//
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
