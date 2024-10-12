/* eslint-env jest */

import JSEncrypt from "jsencrypt";
import {
  encryptMessageContent,
  decryptMessageContent,
  generateSymmetricKey,
  encryptSymmetricKey,
} from "../../utils/encryptionUtils";

describe("Encryption Utilities", () => {
  const message = "Hello, this is a secret message!";
  let symmetricKey;
  let encryptedMessage;
  let publicKey;
  let privateKey;

  beforeAll(() => {
    // Generate a symmetric key
    symmetricKey = generateSymmetricKey();

    // Generate a key pair for testing
    const encrypt = new JSEncrypt({ default_key_size: 2048 });
    publicKey = encrypt.getPublicKey();
    privateKey = encrypt.getPrivateKey();
  });

  test("should encrypt and decrypt message content correctly", () => {
    encryptedMessage = encryptMessageContent(message, symmetricKey);
    const decryptedMessage = decryptMessageContent(
      encryptedMessage,
      symmetricKey
    );
    expect(decryptedMessage).toBe(message);
  });

  test("should encrypt symmetric key with public key", () => {
    const encryptedSymmetricKey = encryptSymmetricKey(symmetricKey, publicKey);
    expect(encryptedSymmetricKey).not.toBeNull();
  });

  test("should decrypt symmetric key with private key", () => {
    const encryptedSymmetricKey = encryptSymmetricKey(symmetricKey, publicKey);
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    const decryptedSymmetricKey = decrypt.decrypt(encryptedSymmetricKey);
    expect(decryptedSymmetricKey).toBe(symmetricKey);
  });
});
