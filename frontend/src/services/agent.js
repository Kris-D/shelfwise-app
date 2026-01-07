import axios from "axios";
import { toast } from "react-toastify";
import { decryptResponse, encryptRequest } from "./cryptos";
import { formDataToEncryptedObject } from "./formDataToEncryptedObject";

export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, //  this is what makes cookies work
  headers: {
    "Content-Type": "text/plain",
    "x-encrypt-response": "true",
    "x-encrypted-request": "true",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // redirect to login
      toast.info("Session expired, please login again");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
    return Promise.reject(error);
  }
);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Optional: add custom headers
    config.headers["Shelfwise-App-Version"] = "1.0.0"; // for backend tracking
    config.headers["Accept-Language"] = "en";

    return config;
  },
  (error) => {
    // Handle any request config errors
    console.error("[REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

const responseBody = (response) => decryptResponse(response.data);

const requests = {
  get: (url) => api.get(url).then(responseBody),
  post: (url, body) => api.post(url, encryptRequest(body)).then(responseBody),
  put: (url, body) => api.put(url, encryptRequest(body)).then(responseBody),
  patch: (url, body) => api.patch(url, encryptRequest(body)).then(responseBody),
  delete: (url) => api.delete(url).then(responseBody),
};

const auth = {
  register: (userData) => requests.post("/users/register", userData),
  login: (userData) => requests.post("/users/login", userData),
  getLoginStatus: () => requests.get("/users/loggedin"),
  logout: () => requests.get("/users/logout"),
  forgotPassword: (userData) =>
    requests.post("/users/forgotPassword", userData),
  resetPassword: (userData, resetToken) =>
    requests.put(`/users/resetpassword/${resetToken}`, userData),
};
const product = {
  createProduct: async (formData) => {
    const encrypted = await formDataToEncryptedObject(formData);
    return api.post("/products", encrypted).then(responseBody);
  },
  productList: () => requests.get("/products"),
  deleteProduct: (productId) => requests.delete(`/products/${productId}`),
  getSingleProduct: (productId) => requests.get(`/products/${productId}`),
  editProduct: async (productId, formData) => {
    const encrypted = await formDataToEncryptedObject(formData);
    return api.patch(`/products/${productId}`, encrypted).then(responseBody);
  },
};
const user = {
  userProfile: (userProfileData) =>
    requests.get("/users/user", userProfileData),
  updateUserProfile: (userProfileData) =>
    requests.patch("/users/updateuser", userProfileData),
  changeUserPassword: (userPasswordData) =>
    requests.patch("/users/changepassword", userPasswordData),
};

const contact = {
  contactUs: (contactUsData) => requests.post("/contactus", contactUsData),
};

const agent = {
  auth,
  product,
  user,
  contact,
};
export default agent;
