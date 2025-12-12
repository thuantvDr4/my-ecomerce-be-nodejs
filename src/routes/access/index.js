"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signup));
router.post("/shop/login", asyncHandler(accessController.login));

//--check authentication
router.use(authentication);
//----logout
router.post("/shop/logout", asyncHandler(accessController.logout));

//--handle refresh token
router.post(
  "/shop/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
