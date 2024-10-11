import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

// Symmetric encryption to encrypt the message content
export const encryptMessageContent = (message, symmetricKey) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(
    message,
    CryptoJS.enc.Hex.parse(symmetricKey),
    {
      iv: iv,
      format: CryptoJS.format.OpenSSL,
    }
  );
  return iv.toString() + ":" + encrypted.toString();
};

// Generate a symmetric key
export const generateSymmetricKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
};

// Asymmetric encryption to encrypt the symmetric key
export const encryptSymmetricKey = (symmetricKey, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(symmetricKey);
};
