"use strict";
const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");

const { authentication, authenticationV2 } = require("../../auth/authUtils");
const cartController = require("../../controllers/cart.controller");

//--PUBLIC
router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.delete));
router.post("/update", asyncHandler(cartController.update));
router.get("", asyncHandler(cartController.getList));

module.exports = router;
