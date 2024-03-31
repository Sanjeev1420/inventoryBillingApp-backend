import mongoose from "mongoose";

import ProductModel from "../models/products.js";
import readImageFile from "../utils/readImageService.js";

const addProduct = async (req, res) => {
  try {
    console.log({ req });
    if (!req.file) {
      console.log(req.filename);
      return res.status(400).json({ error: "Product image is required." });
    }
    const product = {
      productName: req.body.productName,
      productImage: req.file.path,
      category: req.body.category,
      brandId: req.body.brandId,
      purchasePrice: req.body.purchasePrice,
      retailPrice: req.body.retailPrice,
      offerPer: req.body.offerPer,
      threshold: req.body.threshold,
      stock: req.body.stock,
      description: req.body.description,
    };
    const savedProduct = await ProductModel.create(product);
    res.status(201).send({
      message: "Product added successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const getProducts = async (req, res) => {
  const { _id, category } = req.body;
  try {
    var products = [];
    products = await ProductModel.find({ brandId: _id, category: category });
    for (let product of products) {
      const img = await readImageFile(product.productImage);
      product.productImage = img.data;
    }
    res.status(200).send({
      products,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const getProductsByBrandId = async (req, res) => {
  const _id = req.query;
  try {
    const products = await ProductModel.find({ brandId: _id });
    for (let product of products) {
      const img = await readImageFile(product.productImage);
      product.imgMimeType = img.contentType;
      product.productImage = img.data;
    }
    res.status(200).send({
      products: products,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log("updateProduct", await req.body);
    const product = await ProductModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.body._id) },
      req.body,
      { new: true }
    );
    if (product) {
      res.status(200).send({
        message: "Product updated successfully",
        product,
      });
    } else {
      res.status(400).send({
        message: "Product not found!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!!",
    });
  }
};

const deleteProduct = async (req, res) => {
  const delPrdId = req.query._id;
  try {
    if (!delPrdId) {
      return res.status(400).json({ error: "Product ID is required." });
    }
    const deletedProduct = await ProductModel.findByIdAndDelete(delPrdId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!",
    });
  }
};

const getProductsForInvoice = async (req, res) => {
  try {
    const projection = {
      _id: 1,
      productName: 1,
      purchasePrice: 1,
      retailPrice: 1,
      offerPer: 1,
      stock: 1,
    };
    const invoiceProducts = await ProductModel.find({}, projection);

    res.status(200).send({
      products: invoiceProducts,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!",
    });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const thresholdProjection = {
      $match: {
        $expr: { $lte: ["$stock", "$threshold"] },
      },
    };

    const projection = {
      _id: 1,
      productImage: 1,
      productName: 1,
      stock: 1,
      threshold: 1,
    };

    const lowStockProducts = await ProductModel.aggregate([
      thresholdProjection,
      { $project: projection },
    ]);

    for (let product of lowStockProducts) {
      const img = await readImageFile(product.productImage);
      product.imgMimeType = img.contentType;
      product.productImage = img.data;
    }

    res.status(200).send({
      products: lowStockProducts,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!",
    });
  }
};

export default {
  addProduct,
  getProducts,
  getProductsByBrandId,
  updateProduct,
  deleteProduct,
  getProductsForInvoice,
  getLowStockProducts,
};
