const crypto = require("crypto");

const algorithm = "aes-256-cbc";

const encryptMessage = (message, key) => {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Include IV with the encrypted message
};

const decryptMessage = (encryptedMessage, key) => {
  const parts = encryptedMessage.split(":");
  const iv = Buffer.from(parts.shift(), "hex"); // Extract the IV
  const encryptedText = parts.join(":");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encryptMessage, decryptMessage };
