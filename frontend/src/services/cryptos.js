import PBKDF2 from "crypto-js/pbkdf2";
import Utf8 from "crypto-js/enc-utf8";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js"


// Constants 
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const PassPhrase = String(import.meta.env.VITE_PassPhrase);
const SaltValue = String(import.meta.env.VITE_SaltValue);
const InitVector = String(import.meta.env.VITE_InitialVector);
const PasswordIterations = Number.parseInt(String(import.meta.env.VITE_PasswordIterations));
const Blocksize = Number.parseInt(String(import.meta.env.VITE_BlockSize));

function getKey() {
  return PBKDF2(PassPhrase, Utf8.parse(SaltValue), {
    keySize: 256 / Blocksize, // CryptoJS keySize is in words, 1 word = 4 bytes
    iterations: PasswordIterations,
    hasher: CryptoJS.algo.SHA256,
  });
}


// Encryption Service
export const encryptRequest = (request) => {
  console.log("Data sent to encrypt:", request) ;
  const key = getKey();
  // const parsedIV = Utf8.parse(InitVector);
  const parsedIV = CryptoJS.enc.Base64.parse(InitVector)
 
  // Encrypt
 const encrypted = AES.encrypt(JSON.stringify(request), key, {
    iv: parsedIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  // console.log(request);
  // console.log("encrypted:",encrypted);
  console.log("Encryption result:", encrypted.substring(0, 50) + '...');
  return encrypted;
};

// Decryption Service
export const decryptResponse = (response) => {
  // console.log("Response:", response) ;
 const key = getKey();
  // const parsedIV = Utf8.parse(InitVector);
  const parsedIV = CryptoJS.enc.Base64.parse(InitVector)
  //  const encrypted = CryptoJS.lib.CipherParams.create({
  //   ciphertext: CryptoJS.enc.Base64.parse(response)
  // });
 
  // Decrypt
  const bytes = AES.decrypt(response, key, {
    iv: parsedIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedResponse = bytes.toString(CryptoJS.enc.Utf8);
  // console.log("decryptedResponse:",decryptedResponse);
  try {
    return JSON.parse(decryptedResponse);
  } catch {
    return decryptedResponse;
  }
};

// Test Decryption
 const testResponse = "";
let ok = decryptResponse(testResponse);
console.log("ok", ok);
