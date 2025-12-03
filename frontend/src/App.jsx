import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AddProduct,
  Contact,
  Dashboard,
  EditProduct,
  EditProfile,
  Forgot,
  Home,
  Login,
  Profile,
  Register,
  Reset,
} from "./pages";
import Sidebar from "./components/sidebar/Sidebar";
import Layout from "./components/layout/Layout";
import ProductDetail from "./components/product/productDetail/ProductDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Setup caching with react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // set the time interval that query will be refetched (1mins)
      // staleTime: 60 * 1000,
      // set the time interval that query will be refetched (0min)
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/resetpassword/:resetToken" element={<Reset />} />
          <Route
            path="/dashboard"
            element={
              <Sidebar>
                <Layout>
                  <Dashboard />
                </Layout>
              </Sidebar>
            }
          />
          <Route
            path="/add-product"
            element={
              <Sidebar>
                <Layout>
                  <AddProduct />
                </Layout>
              </Sidebar>
            }
          />
          <Route
            path="/product-details/:productId"
            element={
              <Sidebar>
                <Layout>
                  <ProductDetail />
                </Layout>
              </Sidebar>
            }
          />
          <Route
            path="/edit-product/:productId"
            element={
              <Sidebar>
                <Layout>
                  <EditProduct />
                </Layout>
              </Sidebar>
            }
          />
          <Route
            path="/profile"
            element={
              <Sidebar>
                <Layout>
                  <Profile/>
                </Layout>
              </Sidebar>
            }
          />
          <Route
            path="/profile-update"
            element={
              <Sidebar>
                <Layout>
                  <EditProfile/>
                </Layout>
              </Sidebar>
            }
          />
            <Route
          path="/contact-us"
          element={
            <Sidebar>
              <Layout>
                <Contact />
              </Layout>
            </Sidebar>
          }
        />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
