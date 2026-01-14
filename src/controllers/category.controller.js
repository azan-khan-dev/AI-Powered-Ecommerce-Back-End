import { isValidObjectId } from "mongoose";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import {
  removeFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const createCategory = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!title || !description) {
    return next(new CustomError(400, "Please provide title and description"));
  }

  if (!file) {
    return next(new CustomError(400, "Please provide a category image"));
  }

  // Check if category with same title already exists
  const existingCategory = await Category.findOne({ title: title.trim() });
  if (existingCategory) {
    return next(new CustomError(400, "Category with this title already exists"));
  }

  // Upload image to Cloudinary
  const uploadedImage = await uploadOnCloudinary(file, "categories");

  if (!uploadedImage) {
    return next(new CustomError(500, "Failed to upload image"));
  }

  const newCategory = await Category.create({
    title: title.trim(),
    description: description.trim(),
    image: {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});

const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: categories,
  });
});

const getOneCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  if (!isValidObjectId(categoryId)) {
    return next(new CustomError(400, "Invalid category ID"));
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new CustomError(404, "Category not found"));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  if (!isValidObjectId(categoryId)) {
    return next(new CustomError(400, "Invalid category ID"));
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new CustomError(404, "Category not found"));
  }

  const { title, description } = req.body;
  const file = req.file;

  // Check if new title conflicts with existing category
  if (title && title.trim() !== category.title) {
    const existingCategory = await Category.findOne({ title: title.trim() });
    if (existingCategory && existingCategory._id.toString() !== categoryId) {
      return next(new CustomError(400, "Category with this title already exists"));
    }
  }

  // Update basic fields
  if (title !== undefined) category.title = title.trim();
  if (description !== undefined) category.description = description.trim();

  // Handle image update if new file is provided
  if (file) {
    // Delete existing image from Cloudinary
    if (category.image && category.image.public_id) {
      await removeFromCloudinary(category.image.public_id, "image");
    }

    // Upload new image to Cloudinary
    const uploadedImage = await uploadOnCloudinary(file, "categories");

    if (!uploadedImage) {
      return next(new CustomError(500, "Failed to upload new image"));
    }

    // Update image data
    category.image = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  await category.save();
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  if (!isValidObjectId(categoryId)) {
    return next(new CustomError(400, "Invalid category ID"));
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new CustomError(404, "Category not found"));
  }

  // Delete image from Cloudinary
  if (category.image && category.image.public_id) {
    await removeFromCloudinary(category.image.public_id, "image");
  }

  await Category.findByIdAndDelete(categoryId);
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

export {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
