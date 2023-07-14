require('dotenv').config()
const crypto = require('crypto');

// Generate random salt
const salt = crypto.randomBytes(16).toString('hex');

// Encryption
const encrypt = (password, plaintext) => {
  const key = crypto.scryptSync(password, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedData = cipher.update(plaintext, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    salt,
    encryptedData,
  };
};

// Decryption
const decrypt = (password, ciphertext) => {
  const key = crypto.scryptSync(password, ciphertext.salt, 32);
  const iv = Buffer.from(ciphertext.iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedData = decipher.update(ciphertext.encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

// Example usage
const password = process.env.secret_key;
const plaintext = 'Hello, world!';

// Encrypt the plaintext
const ciphertext = encrypt(password, plaintext);
console.log('Ciphertext:', ciphertext);

// Decrypt the ciphertext
const decryptedText = decrypt(password, ciphertext);
console.log('Decrypted Text:', decryptedText);
