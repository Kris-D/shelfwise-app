import React from "react";
import ProductForm from "../../components/product/productForm/ProductForm";
import { useForm } from "react-hook-form";
import agent from "../../services/agent";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    // formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  const addProduct = async (formData) => {
    console.log("formData:", formData);
    const response = await agent.product.createProduct(formData);
    return response;
  };

  const queryClient = useQueryClient();

  const { mutate: addProductMutation, isPending } = useMutation({
    mutationFn: addProduct,
    onSuccess: (response) => {
      queryClient.invalidateQueries("Product");

      if (response.status === 400) {
        toast.error(response.message);
      } else {
        // console.log("response", response.data);

        navigate("/dashboard");
        toast.success("Product Created successfully");
        reset();
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
      // console.error("Error Creating Product:", errorMessage);
      toast.error(errorMessage);
    },
  });
  const generateSKU = (category) => {
    const letter = category.slice(0, 3).toUpperCase();
    const number = Date.now();
    const sku = letter + "-" + number;
    return sku;
  };
  const onSubmit = (data) => {
    // Image file will be in `data.image[0]`
    const productImage = data.image[0];
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("sku", generateSKU(data.category));
    formData.append("category", data.category);
    formData.append("quantity", data.quantity);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("image", productImage);
    console.log("product Form:", ...formData);
    addProductMutation(formData);
  };
  // Trigger toast on validation error
  const onError = (error) => {
    if (error.image) toast.error(error.image.message);
    if (error.name) toast.error(error.name.message);
    if (error.category) toast.error(error.category.message);
    if (error.quantity) toast.error(error.quantity.message);
    if (error.price) toast.error(error.price.message);
    if (error.description) toast.error(error.description.message);
  };
  return (
    <div>
      {isPending && <Loader />}
      <h3 className="--mt">Add New Product</h3>
      <ProductForm
        register={register}
        handleSubmit={handleSubmit}
        watch={watch}
        isPending={isPending}
        onSubmit={onSubmit}
        control={control}
        onError={onError}
        setValue={setValue}
      />
    </div>
  );
};

export default AddProduct;
