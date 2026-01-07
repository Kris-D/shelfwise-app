import { encryptRequest } from "./cryptos";

export const formDataToEncryptedObject = async (formData) => {
  try {
    const data = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        console.log(`Converting ${key} to base64...`);
        data[key] = await fileToBase64(value);
      } else {
        data[key] = value;
      }
    }

    // ✅ This is the ONLY thing that should be encrypted
    console.log("Payload before encryption:", data);

    const encrypted = encryptRequest(data);

    if (!encrypted || encrypted.length < 24) {
      throw new Error("Invalid encryption output");
    }

    console.log("Encrypted payload length:", encrypted.length);
    return encrypted;

  } catch (error) {
    console.error("formDataToEncryptedObject error:", error);
    throw error;
  }
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error(`Failed to read file: ${file.name}`));

    reader.readAsDataURL(file);
  });