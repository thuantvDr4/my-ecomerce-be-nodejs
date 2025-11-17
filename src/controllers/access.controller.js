// @ts-nocheck
"use strict";
const AccessService = require("../services/access.service");

class AccessController {
  async signup(req, res, next) {
    try {
      console.log("::[P]:Signup::", req.body);
      return res.status(201).json(await AccessService.signup(req.body));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccessController();
