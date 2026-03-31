// @ts-nocheck
"use strict";
const { times } = require("lodash");
const mysql = require("mysql2");

//--create connection to pool server
const pool = mysql.createPool({
  host: "localhost",
  port: 8811,
  user: "root",
  password: "root123456",
  database: "test",
});

const batchSize = 100000; // adjust batch size as needed | là kích thước từng lô muốn insert
const totalSize = 10_000_000; // adjust total size as needed
//10_000_000 ::::[TIMER]::::::: 1:08.005 (m:ss.mmm)
let currentId = 1;
console.time("::::[TIMER]::::::");
const insertBatch = async () => {
  const values = [];
  // -----loop through batch size
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `Name ${currentId}`;
    const email = `email${currentId}@gmail.com`;
    const age = currentId;
    values.push([currentId, name, age, email]);
    currentId++;
  }
  //--check
  if (!values.length) {
    console.timeEnd("::::[TIMER]::::::");
    pool.end((err) => {
      if (err) {
        console.error(`Error occurred while running batch: ${err}`);
      } else {
        console.log("connection Pool closed successfully");
      }
    });
    return;
  }
  //---sql insert to table
  const sql = `INSERT INTO test_users (id, name, age, email) VALUES ?`;
  pool.query(sql, [values], async (err, results) => {
    if (err) throw err;
    // inserting
    console.log(`Inserted ${results?.affectedRows} rows`);
    await insertBatch();
  });
  //
};

insertBatch().catch((err) => console.error(err));
