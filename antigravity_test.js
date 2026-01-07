// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto');
// let CryptoJS;
// try {
//   CryptoJS = require("crypto-js");
// } catch (e) {
//   console.error("Failed to load crypto-js. Make sure NODE_PATH is set correctly.");
//   process.exit(1);
// }

// // Constants from frontend/.env
// const PassPhrase = "eZ:J9!Vsr?twFRLW6)<k:y";
// const SaltValue = "2@kQD}lc3a65f)~@*W7";
// const InitVector = "Wk9wT2JIRmhTR1lwU0dGbw==";
// const PasswordIterations = 2; // Verified from frontend/.env
// const Blocksize = 32; 

// function getKey() {
//   return CryptoJS.PBKDF2(PassPhrase, CryptoJS.enc.Utf8.parse(SaltValue), {
//     keySize: 256 / 32, 
//     iterations: PasswordIterations,
//     hasher: CryptoJS.algo.SHA256,
//   });
// }

// const encryptRequest = (request) => {
//   const key = getKey();
//   const parsedIV = CryptoJS.enc.Base64.parse(InitVector);

//   const encrypted = CryptoJS.AES.encrypt(JSON.stringify(request), key, {
//     iv: parsedIV,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   }).toString();
//   return encrypted;
// };

// async function run() {
//     const baseUrl = "http://localhost:5000/api";
//     // const baseUrl = "http://127.0.0.1:5000/api"; 

//     const userEmail = "testupdate_" + Date.now() + "@example.com";
//     const userPass = "password123";
    
//     console.log(`1. Registering user: ${userEmail}`);
//     try {
//         let res = await fetch(`${baseUrl}/users/register`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username: "Test User", email: userEmail, password: userPass }) // FIXED: name -> username
//         });
        
//         let userData = await res.json();
//         if (!res.ok) {
//             console.log("Registration failed, status:", res.status);
//             console.log("Response:", JSON.stringify(userData));
            
//             // Try login
//             console.log("Trying login...");
//              res = await fetch(`${baseUrl}/users/login`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email: userEmail, password: userPass })
//             });
//             userData = await res.json();
//         }
        
//         if (!userData.token) {
//             throw new Error("Failed to authenticate: " + JSON.stringify(userData));
//         }
//         console.log("Logged in. Token length:", userData.token.length);

//         console.log("2. Creating dummy product...");
//         const productPayload = {
//             name: "Test Product " + Date.now(),
//             sku: "SKU-" + Date.now(),
//             category: "Test",
//             quantity: "10",
//             price: "100",
//             description: "Initial description"
//         };
        
//         const encryptedProductPayload = encryptRequest(productPayload);
//         res = await fetch(`${baseUrl}/products`, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "text/plain", 
//                 "Authorization": `Bearer ${userData.token}`,
//                 "x-encrypted-request": "true" 
//             },
//             body: encryptedProductPayload
//         });
        
//         if (!res.ok) {
//              const txt = await res.text();
//              throw new Error("Failed to create product: " + res.status + " " + txt);
//         }

//         const product = await res.json();
//         console.log("Product created:", product._id);
        
//         console.log("3. Preparing Image...");
//         const imagePath = "c:\\Users\\DUNKWURC\\Documents\\project\\Learn\\shelfwise-app\\backend\\assets\\shelfwise-logo.png";
//         if (!fs.existsSync(imagePath)) {
//             throw new Error("Image file not found at " + imagePath);
//         }
//         const imageBuffer = fs.readFileSync(imagePath);
//         const base64Image = "data:image/png;base64," + imageBuffer.toString('base64');
        
//         console.log("4. Updating Product with Encrypted Image...");
//         const updatePayload = {
//             name: product.name + " Updated",
//             category: "Updated Category",
//             quantity: "20",
//             price: "150",
//             description: "Updated description",
//             image: base64Image
//         };
        
//         const encryptedBody = encryptRequest(updatePayload);
        
//         res = await fetch(`${baseUrl}/products/${product._id}`, {
//             method: "PATCH",
//             headers: { 
//                 "Content-Type": "text/plain", 
//                 "Authorization": `Bearer ${userData.token}`,
//                 "x-encrypted-request": "true"
//             },
//             body: encryptedBody
//         });
        
//         console.log("Update response status:", res.status);
//         const updateResponseText = await res.text();
//         console.log("Update response text:", updateResponseText);

//         try {
//             // Need to decrypt response? 
//             // Middleware logic: "If isEncryptedResponse, encrypt response".
//             // I didn't send 'x-encrypt-response: true' header, so response should be plain JSON?
//             // Middleware: const isEncryptedResponse = req.headers["x-encrypt-response"] === "true";
            
//             const updateResult = JSON.parse(updateResponseText);
//              if (updateResult.image && updateResult.image.filePath) {
//                 console.log("SUCCESS: Image uploaded to:", updateResult.image.filePath);
//             } else {
//                 console.error("FAILURE: Image link missing in response.");
//             }
//         } catch (e) {
//             console.error("Response parsing failed. Maybe it IS encrypted or just error text?");
//             // console.error(e);
//         }

//     } catch (err) {
//         console.error("ERROR MSG:", err.message);
//         if (err.cause) console.error("CAUSE:", err.cause);
//     }
// }

// run();
