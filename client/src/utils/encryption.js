import crypto from "crypto";

// Asymmetric encryption to encrypt the symmetric key
export const encryptSymmetricKey = (symmetricKey, publicKey) => {
  const buffer = Buffer.from(symmetricKey, "utf8");
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

// Symmetric encryption to encrypt the message content
export const encryptMessageContent = (message, symmetricKey) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(symmetricKey),
    iv
  );
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

// Generate a symmetric key
export const generateSymmetricKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
