const crypto = require("crypto");

const passPhrase = process.env.PASS_PHRASE;
const saltValue = process.env.SALT_VALUE;
const passwordIterations = parseInt(process.env.PASSWORD_ITERATIONS, 10);
const blockSize = parseInt(process.env.BLOCK_SIZE, 10);
const initialVectorBase64 = process.env.INITIAL_VECTOR.trim();

// Convert IV from base64 to buffer
const initialVectorBuffer = Buffer.from(initialVectorBase64, "base64");

// Validate IV size
if (initialVectorBuffer.length !== 16) {
  throw new Error(
    `INITIAL_VECTOR must decode to exactly 16 bytes. Got ${initialVectorBuffer.length}`
  );
}

// Derive AES key
const key = crypto.pbkdf2Sync(
  passPhrase,
  saltValue,
  passwordIterations,
  blockSize,
  "sha256"
);

function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, initialVectorBuffer);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, initialVectorBuffer);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function encryptionMiddleware(req, res, next) {
  const isEncryptedRequest = req.headers["x-encrypted-request"] === "true";
  const isEncryptedResponse = req.headers["x-encrypt-response"] === "true";

  // 1. Decrypt request body if needed
  if (isEncryptedRequest && req.body && typeof req.body === "string") {
    try {
      req.body = JSON.parse(decrypt(req.body.trim()));
    } catch (err) {
      console.error("Decryption failed:", err.message);
      return res.status(400).json({ error: "Invalid encrypted payload" });
    }
  }

  // 2. Override res.json for encrypted responses
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (isEncryptedResponse) {
      const encrypted = encrypt(JSON.stringify(data));
      res.setHeader("Content-Type", "text/plain");
      return res.send(encrypted); // send raw string
    }
    return originalJson(data);
  };

  next();
}

module.exports = encryptionMiddleware;