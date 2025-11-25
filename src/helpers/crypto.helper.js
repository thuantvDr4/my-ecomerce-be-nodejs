const crypto = require("crypto");

const generateKeys = async () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  return { privateKey, publicKey };
};

const generateKeyByRandomBytes = () => {
  return crypto.randomBytes(64).toString("hex");
};

module.exports = {
  generateKeys,
  generateKeyByRandomBytes,
};
