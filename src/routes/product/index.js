"use strict";
const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

//--check authentication
router.use(authenticationV2);
//----logout
router.post("", asyncHandler(productController.createproduct));

module.exports = router;
