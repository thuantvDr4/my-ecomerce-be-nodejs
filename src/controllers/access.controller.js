// @ts-nocheck
"use strict";
const { CREATED } = require("../core/success.response");
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
}

module.exports = new AccessController();
