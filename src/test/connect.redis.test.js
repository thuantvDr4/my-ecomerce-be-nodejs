// @ts-nocheck
"use strict";
const redis = require("redis");

async function testConnection() {
  // 1. Khởi tạo client
  const redisClient = redis.createClient({
    // Nếu ông đổi port docker thì sửa ở đây, mặc định là redis://localhost:6379
    url: "redis://localhost:6379",
  });

  // 2. Bắt lỗi kết nối
  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  try {
    // 3. CỰC KỲ QUAN TRỌNG: Phải có lệnh connect()
    await redisClient.connect();
    // 4. Test bằng lệnh ping
    const result = await redisClient.ping();
    console.log("Redis connected::", result); // Sẽ in ra: PONG
  } catch (err) {
    console.error("Error connecting to redis:::", err);
  } finally {
    // Đóng kết nối sau khi test xong (nếu cần)
    console.log("Redis closed::");
    await redisClient.quit();
  }
}

testConnection();
