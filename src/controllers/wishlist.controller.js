import { isValidObjectId } from "mongoose";
import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";

// Add product to wishlist
const addToWishlist = asyncHandler(async (req, res, next) => {
  const customerId = req?.user?._id;
  const { productId } = req.body;

  if (!customerId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  if (!productId || !isValidObjectId(productId)) {
    return next(new CustomError(400, "Valid product ID is required"));
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new CustomError(404, "Product not found"));
  }

  // Check if product is already in wishlist
  const existingWishlistItem = await Wishlist.findOne({
    customer: customerId,
    product: productId,
  });

  if (existingWishlistItem) {
    return next(new CustomError(400, "Product already in wishlist"));
  }

  // Add to wishlist
  const wishlistItem = await Wishlist.create({
    customer: customerId,
    product: productId,
  });

  // Populate product details
  await wishlistItem.populate("product", "name price images");

  res.status(201).json({
    success: true,
    message: "Product added to wishlist successfully",
    data: wishlistItem,
  });
});

// Remove product from wishlist
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const customerId = req?.user?._id;
  const { productId } = req.params;

  if (!customerId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  if (!productId || !isValidObjectId(productId)) {
    return next(new CustomError(400, "Valid product ID is required"));
  }

  // Find and remove the wishlist item
  const wishlistItem = await Wishlist.findOneAndDelete({
    customer: customerId,
    product: productId,
  });

  if (!wishlistItem) {
    return next(new CustomError(404, "Product not found in wishlist"));
  }

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist successfully",
  });
});

// Get all wishlist products for a user
const getUserWishlist = asyncHandler(async (req, res, next) => {
  const customerId = req?.user?._id;

  if (!customerId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  // Get wishlist items with populated product details
  const wishlistItems = await Wishlist.find({ customer: customerId })
    .populate("product", "name price images description category rating reviews stock")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: wishlistItems,
    count: wishlistItems.length,
  });
});

// Check if product is in user's wishlist
const checkWishlistStatus = asyncHandler(async (req, res, next) => {
  const customerId = req?.user?._id;
  const { productId } = req.params;

  if (!customerId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  if (!productId || !isValidObjectId(productId)) {
    return next(new CustomError(400, "Valid product ID is required"));
  }

  const wishlistItem = await Wishlist.findOne({
    customer: customerId,
    product: productId,
  });

  res.status(200).json({
    success: true,
    inWishlist: !!wishlistItem,
  });
});

export {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  checkWishlistStatus,
};