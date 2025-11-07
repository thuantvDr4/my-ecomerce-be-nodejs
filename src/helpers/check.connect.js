"use strict";
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECOND = 5000;

// check connect
const countConnect = () => {
  const count = mongoose.connections.length;
  console.log(`Number of connections:: ${count}`);
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numbConnections = mongoose.connections.length;
    const numbCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connections:: ${numbConnections}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024}MB`);

    const maxConnections = numbCores * 5;
    if (numbConnections > maxConnections) {
      console.log(`Connections overload detected!`);
    }
  }, _SECOND); // Monitor every 5 second
};

module.exports = {
  countConnect,
  checkOverload,
};
