import { encryptRequest } from "./cryptos";

// Helper to convert FormData to encrypted object
export const formDataToEncryptedObject = async (formData) => {
  try {
    console.log("FormData entries:");
    const data = {};
    
    // Log all FormData entries and build data object
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
      
      if (data[key]) {
        data[key] = Array.isArray(data[key]) 
          ? [...data[key], value]
          : [data[key], value];
      } else {
        data[key] = value;
      }
    }

    // Process image fields
    if (data.image) {
      // Handle single file
      if (data.image instanceof File) {
        data.image = await fileToBase64(data.image);
      }
    }

    // Encrypt with validation
    const encrypted = encryptRequest(data);
    
    if (!encrypted || encrypted === '{}' || encrypted.length < 24) {
      const errorMsg = `Invalid encryption result: ${encrypted?.substring(0, 100) || 'undefined'}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log("Encrypted payload length:", encrypted.length);
    return encrypted;
    
  } catch (error) {
    console.error("Error in formDataToEncryptedObject:", error);
    throw new Error(`Failed to encrypt form data: ${error.message}`);
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!(file instanceof File)) {
      reject(new Error(`Expected File object but got ${typeof file}`));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader returned non-string result"));
      }
    };
    
    reader.onerror = error => {
      console.error("FileReader error:", error);
      reject(new Error(`Failed to read file: ${file.name}`));
    };
    
    reader.readAsDataURL(file);
  });
};