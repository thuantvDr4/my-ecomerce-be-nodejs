"use strict";
const express = require("express");
const router = express.Router();

router.post("/shop/signup", (req, res, next) => {
  return res.status(200).json({
    message: "sign up...",
  });
});

module.exports = router;
