"use strict";
const mysq = require("mysql2");

// create connection to pool server
const pool = mysq.createPool({
  host: "localhost",
  user: "thuancafe",
  password: "123456",
  database: "shopDev",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0
});

// perform a simple operation
// pool.query("SELECT 1 + 2 AS solution", function (err, results, fields) {
pool.query("SELECT * from users", function (err, results, fields) {
  if (err) throw err;
  console.log("query result:: ", results);

  // close pool
  pool.end((err) => {
    if (err) throw err;
    console.log("Pool closed");
  });
});
