// encrypt.js
const crypto = require("crypto");

const passPhrase = process.env.PASS_PHRASE;
const saltValue = process.env.SALT_VALUE;
const passwordIterations = parseInt(process.env.PASSWORD_ITERATIONS, 10);
const blockSize = parseInt(process.env.BLOCK_SIZE, 10); // bytes (32 => 256-bit key)
const initialVector = process.env.INITIAL_VECTOR; // must be 16 chars

if (!passPhrase || !saltValue || !initialVector) {
  throw new Error("Missing encryption environment variables.");
}
if (initialVector.length !== 16) {
  throw new Error("INITIAL_VECTOR must be exactly 16 characters long.");
}

// Derive AES key from passphrase + salt
function getKey() {
  // pbkdf2Sync(password, salt, iterations, keylenBytes, digest)
  // we use sha256; key length = blockSize (bytes)
  return crypto.pbkdf2Sync(
    passPhrase,
    saltValue,
    passwordIterations,
    blockSize,
    "sha256"
  );
}

// Encrypt JS object -> base64 string
function encryptData(obj) {
  const json = JSON.stringify(obj);
  const key = getKey(); // Buffer length = blockSize
  const iv = Buffer.from(initialVector, "utf8"); // 16 bytes
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  cipher.setAutoPadding(true); // PKCS7 padding
  let encrypted = cipher.update(json, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted; // only ciphertext, base64 encoded
}

// Decrypt base64 string -> JS object
function decryptData(encryptedBase64) {
  const key = getKey();
  const iv = Buffer.from(initialVector, "utf8");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  decipher.setAutoPadding(true); // PKCS7 padding
  let out = decipher.update(encryptedBase64, "base64", "utf8");
  out += decipher.final("utf8");
  return JSON.parse(out);
}

module.exports = { encryptData, decryptData };