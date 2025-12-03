import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice"
import productReducer from "./features/product/productSlice"
import fiterReducer from "./features/product/fiterSlice"





 export const store = configureStore({
  reducer:{
    auth: authReducer,
    product: productReducer,
    fiter: fiterReducer,
  }
});

 