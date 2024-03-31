import mongoose from "mongoose";

import BrandModel from "../models/brand.js";
import readImageFile from "../utils/readImageService.js";

const addBrand = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        message: "Brand image is required.",
      });
    }
    const otherFields = {
      brandName: req.body.brandName,
      brandImage: req.file.path,
      categories: req.body.categories || [],
    };
    const savedBrand = await BrandModel.create(otherFields);
    const img = await readImageFile(savedBrand.brandImage);
    savedBrand.imgMimeType = img.contentType;
    savedBrand.brandImage = img.data;
    res.status(201).json(savedBrand);
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).send({ error });
  }
};

const getAllBrand = async (req, res) => {
  try {
    var brands = [];
    brands = await BrandModel.find();
    for (let brand of brands) {
      const img = await readImageFile(brand.brandImage);
      brand.imgMimeType = img.contentType;
      brand.brandImage = img.data;
    }
    res.status(200).send({
      brands
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Error fetching brands" });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { _id, updatedName } = req.body;
    const brand = await BrandModel.findById(new mongoose.Types.ObjectId(_id));
    if (brand) {
      brand.brandName = updatedName;
      const updatedBrand = await brand.save();
      const img = await readImageFile(updatedBrand.brandImage);
      updatedBrand.imgMimeType = img.contentType;
      updatedBrand.brandImage = img.data;
      res.status(200).send({
        message: "Brand updated successfully",
        updatedBrand,
      });
    } else {
      res.status(402).send({
        meassage: "Invalid brand",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!",
    });
  }
};

const deleteBrand = async (req, res) => {
  const _id = req.query._id;
  try {
    if (!_id) {
      return res.status(400).json({ error: "Brand ID is required." });
    }
    const deletedBrand = await BrandModel.findByIdAndDelete(_id);
    if (!deletedBrand) {
      return res.status(404).json({ error: "Brand not found." });
    }
    res
      .status(200)
      .json({ _id: deletedBrand._id, message: "Brand deleted successfully." });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Internal Server Error!",
    });
  }
};

const addCategory = async (req, res) => {
  const { _id, category } = req.body;
  try {
    if (!_id || !category) {
      return res
        .status(400)
        .json({ message: "Invalid data. Brand ID and category are required." });
    }
    const brand = await BrandModel.findById(_id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found." });
    }
    brand.categories.push(category);
    const updatedBrand = await brand.save();

    res.status(200).json({
      message: "Category added successfully",
      updatedBrand,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(500)
      .json({ message: error.message || "Internal Server Error!" });
  }
};

const deleteCategory = async (req, res) => {
  const { _id, category } = req.body;
  try {
    if (!_id || !category) {
      return res
        .status(400)
        .json({ message: "Invalid data. Brand ID and category are required." });
    }
    const brand = await BrandModel.findById(_id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found." });
    }
    const index = brand.categories.indexOf(category);
    if (index !== -1) {
      brand.categories.splice(index, 1);
    } else {
      return res
        .status(404)
        .json({ message: "Category not found in the brand." });
    }
    const updatedBrand = await brand.save();
    res.status(200).json({
      message: "Category deleted successfully",
      updatedBrand,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ message: error.message || "Internal Server Error!" });
  }
};

export default {
  addBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
  addCategory,
  deleteCategory,
};
