import {
  encryptMessageContent,
  decryptMessageContent,
  generateSymmetricKey,
} from '../../utils/encryptionUtils';

describe('Encryption Utilities', () => {
  const testMessage = 'Hello, this is a test message!';
  let symmetricKey: string;

  beforeEach(() => {
    symmetricKey = generateSymmetricKey();
  });

  test('should encrypt and decrypt message successfully', () => {
    const encrypted = encryptMessageContent(testMessage, symmetricKey);
    const decrypted = decryptMessageContent(encrypted, symmetricKey);
    expect(decrypted).toBe(testMessage);
  });

  test('should generate different symmetric keys', () => {
    const key1 = generateSymmetricKey();
    const key2 = generateSymmetricKey();
    expect(key1).not.toBe(key2);
  });

  test('should throw error when decrypting with wrong key', () => {
    const encrypted = encryptMessageContent(testMessage, symmetricKey);
    const wrongKey = generateSymmetricKey();
    expect(() => {
      decryptMessageContent(encrypted, wrongKey);
    }).toThrow();
  });
}); 