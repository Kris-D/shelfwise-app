import React from "react";
// import useRedirectLoggedOutUser from "../../customHooks/useRedirectLoggedOutUser";
import ProductList from "../../components/product/productList/ProductList";
import { toast } from "react-toastify";
import { useProductList } from "../../customHooks/useProductList";
import ProductSummary from "../../components/product/productSummary/ProductSummary";
import agent from "../../services/agent";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  // useRedirectLoggedOutUser("/login");
  const { products = [], isPending, error } = useProductList();

  if (error) {
    toast.error(error.message);
  }
  // console.log("products:",products);
  let totalStoreValue = 0;
  let outOfStock = 0;
  let category = [];

  products.forEach((item) => {
    const { price, quantity, category: cat } = item;

    // Add to total store value
    totalStoreValue += price * quantity;

    // Check out-of-stock
    if (quantity === "0") {
      outOfStock += 1;
    }

    // Add unique category
    if (cat && !category.includes(cat)) {
      category.push(cat);
    }
  });
  const deleteProduct = async (productId) => {
    // console.log("productId:", productId);
    const response = await agent.product.deleteProduct(productId);
    return response;
  };
  const queryClient = useQueryClient();
  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (response) => {
      queryClient.invalidateQueries("Product");

      if (response.status === 400) {
        toast.error(response.message);
      } else {
        // console.log("response", response.data);
        toast.success("Product Deleted successfully");
      }
    },
    // On error, show an error toast
    onError: (error) => {
      const errorMessage =
        (error?.response &&
          error?.response?.data &&
          error?.response?.data?.message) ||
        error?.message ||
        error?.toString() ||
        "Something went wrong";
      // console.error("Error Deleting Product:", errorMessage);
      toast.error(errorMessage);
    },
  });
  const handleDeleteProduct = (id) => {
    deleteProductMutation(id);
  };
  return (
    <div className="">
      <ProductSummary
        products={products}
        totalStoreValue={totalStoreValue}
        outOfStock={outOfStock}
        category={category}
      />
      <ProductList
        products={products}
        isPending={isPending}
        handleDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default Dashboard;
