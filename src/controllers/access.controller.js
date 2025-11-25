// @ts-nocheck
"use strict";
const { CREATED, SUCCESS } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  async signup(req, res, next) {
    // return res.status(201).json(await AccessService.signup(req.body));
    new CREATED({
      message: "Resigeted OK!",
      metadata: await AccessService.signup(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  }

  //--login
  async login(req, res, next) {
    new SUCCESS({
      message: "Login OK!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  }
}

module.exports = new AccessController();
