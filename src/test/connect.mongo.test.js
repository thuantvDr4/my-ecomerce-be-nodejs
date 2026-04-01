"use strict";
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://localhost:27017/test_docker_db";

async function connectToMongo() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully! ✅");

    // check status
    // 2. Kiểm tra trạng thái connection (0: disconnected, 1: connected, 2: connecting, 3: disconnecting)
    const state = mongoose.connection.readyState;
    console.log("MongoDB connection state::: ", state);
  } catch (err) {
    console.error("MongoDB connection error: ❌", err.message);
  } finally {
    //
  }
}

// close mongo
async function closeMongo() {
  try {
    await mongoose.disconnect();
    console.log("MongoDB connection closed! 🚪");
  } catch (err) {
    console.error("Error closing MongoDB:", err);
  }
}

//--run
async function run() {
  try {
    await connectToMongo();
    // Định nghĩa 1 Schema đơn giản
    const TestSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model("Test", TestSchema);
    //1. insert record
    await TestModel.create({ name: "Hello docker" });
    console.log("Insert record success!");
  } catch (err) {
    console.error("Insert record error: ❌", err.message);
  } finally {
    await closeMongo();
  }
}

run();
