// @ts-nocheck
"use strict";
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    name: process.env.DEV_DB_NAME || "shopDev",
    port: process.env.DEV_DB_PORT || 27017,
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    name: process.env.PRO_DB_NAME || "shopDev",
    port: process.env.PRO_DB_PORT || 27017,
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
