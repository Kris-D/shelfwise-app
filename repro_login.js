// const crypto = require("crypto");
// // Constants matching backend/frontend
// const PASS_PHRASE = "My Secret Passphrase"; 
// const SALT_VALUE = "My Salt Value";
// const PASSWORD_ITERATIONS = 1000;
// const BLOCK_SIZE = 256;
// const INITIAL_VECTOR = "AAAAAAAAAAAAAAAAAAAAAA=="; // Base64 for 16 null bytes? No, just example.
// // We need to use the SAME env values as backend.
// // Since I can't easily import .env here without dotenv, I'll rely on the server running with its own .env
// // BUT I need to encrypt correctly to talk to it.

// // Wait, I can't easily encrypt without knowing the EXACT keys/iv the backend uses.
// // I can read the .env file?
// // Or I can send a PLAIN text request to see if it works?
// // The middleware only encrypts if headers are present.

// // Let's try sending a plain JSON request WITHOUT headers to see if logic holds.
// // If I send JSON without 'x-encrypted-request', it should bypass decryption.
// // valid user? No. Invalid user.
// // Expectation: 400 or 401.

// async function testLogin() {
//   const url = "http://localhost:5000/api/users/login";
//   const body = JSON.stringify({
//     email: "nonexistent@example.com",
//     password: "password123"
//   });

//   try {
//     console.log("Sending invalid login request (Unencrypted)...");
//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: body
//     });

//     console.log("Status:", res.status);
//     const text = await res.text();
//     console.log("Response:", text);

//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

// testLogin();
