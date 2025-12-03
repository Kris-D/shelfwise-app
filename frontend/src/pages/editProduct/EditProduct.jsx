import React from "react";
import ProductForm from "../../components/product/productForm/ProductForm";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../services/agent";
import { toast } from "react-toastify";
import { useSingleProduct } from "../../customHooks/useSingleProduct";
import Loader from "../../components/loader/Loader";

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { product = [], isPending: isSingleProductPending } = useSingleProduct({
    productId,
  });
  const {
    register,
    handleSubmit,
    control,
    // formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();

  const editProduct = async (formData) => {
    // console.log("formData:", formData);
    const response = await agent.product.editProduct(productId,formData);
    return response;
  };

  const queryClient = useQueryClient();

  const { mutate: editProductMutation, isPending } = useMutation({
    mutationFn: editProduct,
    onSuccess: (response) => {
      queryClient.invalidateQueries("Product");

      if (response.status === 400) {
        toast.error(response.message);
      } else {
        // console.log("response", response.data);

        navigate("/dashboard");
        toast.success("Product Edited successfully");
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
      // console.error("Error Editing Product:", errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    // Append fields preferring new values (data) but falling back to product existing values
    formData.append("name", data.name || product.name);
    formData.append("sku", product.sku); // keep SKU same
    formData.append("category", data.category || product.category);
    formData.append("quantity", data.quantity || product.quantity);
    formData.append("price", data.price || product.price);
    formData.append("description", data.description || product.description);

    // Append image only if user provided a new file
    const productImageFile = data.image?.[0]; // new upload if any
    if (productImageFile) {
      formData.append("image", productImageFile);
    }

    // console.log("product Form:", ...formData);
    editProductMutation(formData);
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
      <h3 className="--mt">Edit Product</h3>
      {!isSingleProductPending && product ? (
        <ProductForm
          register={register}
          handleSubmit={handleSubmit}
          watch={watch}
          isPending={isPending}
          onSubmit={onSubmit}
          control={control}
          onError={onError}
          setValue={setValue}
          initialData={product}
          isEdit={true}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default EditProduct;
