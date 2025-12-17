"use strict";
const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//--check authentication
router.use(authentication);
//----logout
router.post("", asyncHandler(productController.createproduct));

module.exports = router;
