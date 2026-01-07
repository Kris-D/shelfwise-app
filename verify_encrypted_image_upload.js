const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Node crypto for polyfill or we use crypto-js if available
const CryptoJS = require("crypto-js"); // Assuming backend/frontend has it.
// Constants from frontend/.env
const PassPhrase = "eZ:J9!Vsr?twFRLW6)<k:y";
const SaltValue = "2@kQD}lc3a65f)~@*W7";
const InitVector = "Wk9wT2JIRmhTR1lwU0dGbw==";
const PasswordIterations = 2; // VITE_PasswordIterations
const Blocksize = 32; // VITE_BlockSize (in bytes? No, frontend says 256/Blocksize. Wait. VITE_BlockSize=32 usually means 32 bytes = 256 bits).

// Encryption helper (Ported from frontend/src/services/cryptos.js)
function getKey() {
  return CryptoJS.PBKDF2(PassPhrase, CryptoJS.enc.Utf8.parse(SaltValue), {
    keySize: 256 / 32, 
    iterations: PasswordIterations,
    hasher: CryptoJS.algo.SHA256,
  });
}

const encryptRequest = (request) => {
  const key = getKey();
  const parsedIV = CryptoJS.enc.Base64.parse(InitVector);

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(request), key, {
    iv: parsedIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return encrypted;
};

// Main execution
async function run() {
    const baseUrl = "http://localhost:5000/api";
    
    // 1. Register/Login User
    const userEmail = "testupdate_" + Date.now() + "@example.com";
    const userPass = "password123";
    
    console.log(`1. Registering user: ${userEmail}`);
    let res = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Plain registration usually? Or is EVERYTHING encrypted?
        // Checking server.js: app.use(encryption) is GLOBAL. So everything must be encrypted if we send body?
        // Wait, server.js: app.use(express.json()); app.use(express.text()); app.use(encryption);
        // Encryption middleware decrypts IF 'x-encrypted-request' === 'true'.
        // If I send plain JSON without that header, it might work if the middleware allows passing through plain body.
        // Looking at encryptionMiddleware.js: 
        // if (isEncryptedRequest && req.body && typeof req.body === "string") { decrypt ... }
        // So if I don't send header, it uses plain body.
        // I will try plain first for simplicity.
        body: JSON.stringify({ name: "Test User", email: userEmail, password: userPass })
    });
    
    let userData = await res.json();
    if (!res.ok) {
        console.log("Registration failed or user exists, trying login...");
        res = await fetch(`${baseUrl}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail, password: userPass })
        });
        userData = await res.json();
    }
    
    if (!userData.token) {
        console.error("Failed to authenticate:", userData);
        return;
    }
    console.log("Logged in. Token:", userData.token);
    
    // 2. Create Product (Plain request for simplicity if allowed, otherwise encrypt)
    // Actually, let's use ENCRYPTED request to verify the full flow including the base64 image which HAS to be encrypted?
    // Wait, the user's issue was encrypted request image upload. So I MUST use encrypted request for the UPDATE.
    
    console.log("2. Creating dummy product...");
    const productPayload = {
        name: "Test Product " + Date.now(),
        sku: "SKU-" + Date.now(),
        category: "Test",
        quantity: "10",
        price: "100",
        description: "Initial description"
    };
    
    res = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${userData.token}` 
        },
        body: JSON.stringify(productPayload)
    });
    const product = await res.json();
    console.log("Product created:", product._id);
    
    // 3. Prepare Image (Base64)
    console.log("3. Preparing Image...");
    const imagePath = "c:\\Users\\DUNKWURC\\Documents\\project\\Learn\\shelfwise-app\\backend\\assets\\shelfwise-logo.png";
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = "data:image/png;base64," + imageBuffer.toString('base64');
    
    // 4. Update Product with Encrypted Payload containing Image
    console.log("4. Updating Product with Encrypted Image...");
    const updatePayload = {
        name: product.name + " Updated",
        category: "Updated Category",
        quantity: "20",
        price: "150",
        description: "Updated description",
        image: base64Image // Passing Base64 string directly
    };
    
    const encryptedBody = encryptRequest(updatePayload);
    
    res = await fetch(`${baseUrl}/products/${product._id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "text/plain", // Must be text/plain for encryption middleware to parse string body
            "Authorization": `Bearer ${userData.token}`,
            "x-encrypted-request": "true"
        },
        body: encryptedBody
    });
    
    console.log("Update response status:", res.status);
    const updateResult = await res.json(); // Response might be encrypted? Middleware handles res.json override. x-encrypt-response header?
    // Middleware checks "x-encrypt-response". I didn't send it, so it should be plain JSON response?
    // Check middleware: const isEncryptedResponse = req.headers["x-encrypt-response"] === "true";
    
    console.log("Update Result:", JSON.stringify(updateResult, null, 2));
    
    if (updateResult.image && updateResult.image.filePath) {
        console.log("SUCCESS: Image uploaded to:", updateResult.image.filePath);
    } else {
        console.error("FAILURE: Image link missing in response.");
    }
}

run().catch(console.error);
