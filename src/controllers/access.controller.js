// @ts-nocheck
"use strict";
const { CREATED, SUCCESS } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  //handle refresh token
  async handleRefreshToken(req, res, next) {
    new SUCCESS({
      message: "Get token success!",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  }
  //--logout
  async logout(req, res, next) {
    new SUCCESS({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  }

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
