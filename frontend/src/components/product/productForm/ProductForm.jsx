import React, { useEffect, useState } from "react";
import "./ProductForm.scss";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../card/Card";
const ProductForm = ({
  register,
  handleSubmit,
  onSubmit,
  watch,
  isPending,
  control,
  onError,
  setValue,
  initialData = null,
  isEdit = false,
}) => {
  const [displayPrice, setDisplayPrice] = useState("");
  const [displayQuantity, setDisplayQuantity] = useState("");
  const imagePreview = watch("image")?.[0];
  // console.log('initialData:', initialData)

  // Populate form values when initialData exists (for edit)
  useEffect(() => {
    if (!initialData) return;

    // Set text fields
    setValue("name", initialData.name || "");
    setValue("category", initialData.category || "");
    setValue("price", initialData.price ?? ""); // raw numeric price stored
    setValue("quantity", initialData.quantity ?? "");
    setValue("description", initialData.description || "");

    // Setup display values
    if (initialData.price !== undefined && initialData.price !== null) {
      // ensure string for formatPrice
      const p = String(initialData.price);
      setDisplayPrice(formatPrice(p));
    }
    if (initialData.quantity !== undefined && initialData.quantity !== null) {
      setDisplayQuantity(
        String(initialData.quantity).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    }
  }, [initialData, setValue]);

  const imagePreviewFile = imagePreview;
  const existingImageUrl = initialData?.image?.filePath || null;

  const formatPrice = (value) => {
    if (!value) return "";
    const [intPart, decPart] = value.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `₦${formattedInt}${decPart ? "." + decPart : ""}`;
  };
  const handlePriceChange = (e) => {
    let inputValue = e.target.value;

    // Remove ₦ and commas
    const cleaned = inputValue.replace(/₦|,/g, "");

    // Reject multiple dots
    if ((cleaned.match(/\./g) || []).length > 1) return;

    // Match a valid pattern with optional decimal
    const match = cleaned.match(/^\d*(\.\d{0,2})?$/);
    if (!match) return;

    // Split int and decimal part manually
    const [intPart, decPart] = cleaned.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    let formattedDisplay = `₦${formattedInt}`;
    if (decPart !== undefined) {
      formattedDisplay += "." + decPart;
    } else if (inputValue.endsWith(".")) {
      // preserve trailing decimal dot while typing
      formattedDisplay += ".";
    }

    setDisplayPrice(formattedDisplay);

    // Set raw value to RHF
    const num = parseFloat(cleaned);
    if (!isNaN(num)) {
      setValue("price", num.toFixed(2));
    } else {
      setValue("price", "");
    }
  };
  const handleQuantityChange = (e) => {
    const inputValue = e.target.value;

    // Remove commas
    const raw = inputValue.replace(/,/g, "");

    // Allow only digits
    if (!/^\d*$/.test(raw)) return;

    // Format with commas
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setDisplayQuantity(formatted);

    // Set raw number to RHF
    setValue("quantity", raw);
  };
  return (
    <div className="add-product">
      <Card cardClass={"card"}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Card cardClass={"group"}>
            <label>Product Image:</label>
            <code className={"--color-dark"}>
              Supported Formats: jpg, jpeg, png
            </code>
            <input
              type="file"
              accept="image/*"
              {...register(
                "image",
                // make image required only when not editing, or if the caller wants it required.
                isEdit ? {} : { required: "Product Image is required" }
              )}
            />
            {imagePreviewFile ? (
              <div className="image-preview">
                <img src={URL.createObjectURL(imagePreviewFile)} alt="Preview Product Image" />
              </div>
            ) : existingImageUrl ? (
              <div className="image-preview">
                {/* show existing image URL when editing */}
                <img src={existingImageUrl} alt="Existing Product Image" />
              </div>
            ) : (
              <p>No image set for this product. </p>
            )}
          </Card>
          <label>Product Name:</label>
          <input
            type="text"
            placeholder="Product Name"
            {...register("name", { required: "Product Name is required" })}
          />
          <label>Product Category:</label>
          <input
            type="text"
            placeholder="Product Category"
            {...register("category", {
              required: "Product Category is required",
            })}
          />
          <label>Product Price:</label>
          <input
            type="text"
            placeholder="₦0.00"
            value={displayPrice || formatPrice(watch("price") || "")}
            onChange={handlePriceChange}
          />
          <input
            type="hidden"
            {...register("price", { required: "Product Price is required" })}
          />
          <label>Product Quantity:</label>
          <input
            type="text"
            placeholder="Product Quantity"
            value={displayQuantity}
            onChange={handleQuantityChange}
          />
          <input
            type="hidden"
            {...register("quantity", {
              required: "Product Quantity is required",
            })}
          />
          <label>Product Description:</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Product description is required" }}
            defaultValue=""
            render={({ field }) => (
              <ReactQuill
                {...field}
                onChange={field.onChange}
                value={field.value}
                theme="snow"
                placeholder="Enter product description"
                modules={ProductForm.modules}
                formats={ProductForm.formats}
              />
            )}
          />
          <div className="--my">
            <button
              className="--btn --btn-primary"
              type="submit"
              disabled={isPending}
              style={{
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? "Submitting..." : isEdit ? "Save Changes" : "Save Product"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default ProductForm;
