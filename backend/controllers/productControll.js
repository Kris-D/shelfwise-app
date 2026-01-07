const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUploader");
const cloudinary = require("cloudinary").v2;

// Create Product
const createProduct = asyncHandler(async (req, res) => {
    console.log("REQ.FILE ===>", req.file);
  const { name, sku, description, price, quantity, category } = req.body;

  // Validation check if product already exists
  if (!name || !sku || !description || !price || !quantity || !category) {
    res.status(400);
    throw new Error("All fields are required");
  }
  // Handle Image Upload
  let fileData = {};
  if (req.file) {
    // Image Upload to Cloudinary (Standard multipart)
    let uploadFile;
    try {
      uploadFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "ShelfWise App",
        resource_type: "image",
      });
      console.log("CLOUDINARY UPLOAD FILE ===>", uploadFile); 
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  } else if (req.body.image && typeof req.body.image === 'string') {
     // Image Upload to Cloudinary (Base64 from Encrypted Body)
    let uploadFile;
    try {
      // Cloudinary handles Base64 strings automatically (data:image/...)
      uploadFile = await cloudinary.uploader.upload(req.body.image, {
        folder: "ShelfWise App",
        resource_type: "image",
      });
      console.log("CLOUDINARY UPLOAD BASE64 ===>", uploadFile);
    } catch (error) {
       console.error("Cloudinary Base64 Upload Error:", error);
      res.status(500);
      throw new Error("Image could not be uploaded (Base64)");
    }

    fileData = {
      fileName: "uploaded_image_" + Date.now(), // Fallback name
      filePath: uploadFile.secure_url,
      fileType: "image/jpeg", // Assume jpg or extract from data string if needed
      fileSize: fileSizeFormatter(uploadFile.bytes, 2),
    };
  }

  // create product here
  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    description,
    price,
    quantity,
    category,
    image: fileData,
  });
  console.log("SAVED PRODUCT ===>", product);
  res.status(201).json(product);
});

// Get Product list
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// Get Single Product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if Product does not exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // match user id with product user id
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized to access this product");
  }
  res.status(200).json(product);
});

//Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if Product does not exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // match user id with product user id
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized to delete this product");
  }
  await product.deleteOne();
  res.status(200).json({ message: "Product deleteed successfully" });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if Product does not exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // match user id with product user id
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized to access this product");
  }

  // Handle Image Upload
  let fileData = {};
console.log("REQ.FILE ===>", req.file);
  
  if (req.file) {
    // Image Upload to Cloudinary (Standard)
    let uploadFile;
    try {
      uploadFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "ShelfWise App",
        resource_type: "image",
      });
      console.log("CLOUDINARY UPLOAD FILE ===>", uploadFile);
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('data:image')) {
     // Image Upload to Cloudinary (Base64) - Check if it's a new image
    let uploadFile;
    try {
      uploadFile = await cloudinary.uploader.upload(req.body.image, {
        folder: "ShelfWise App",
        resource_type: "image",
      });
      console.log("CLOUDINARY UPLOAD BASE64 ===>", uploadFile);
    } catch (error) {
       console.error("Cloudinary Base64 Update Error:", error);
      res.status(500);
      throw new Error("Image could not be uploaded (Base64)");
    }

    fileData = {
      fileName: "uploaded_image_" + Date.now(),
      filePath: uploadFile.secure_url,
      fileType: "image/jpeg",
      fileSize: fileSizeFormatter(uploadFile.bytes, 2),
    };
  } else {
     // No new image uploaded, check if image is an object (existing image data)
     // If req.body.image is the existing image object, we might just keep it?
     // The Update logic below handles this usually by checking Object.keys(fileData).length
  }

  // update product here
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      description,
      price,
      quantity,
      category,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
