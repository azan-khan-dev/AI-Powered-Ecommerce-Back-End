import express from "express";
import {
  searchProducts,
  getTopCategories,
  getFlashSaleProducts,
  getAllFlashSaleProducts,
  getBestSellingProducts,
  getAllBestSellingProducts,
  getFeaturedProducts,
  getAllProducts,
  getProductsByCategory,
} from "../controllers/home.controller.js";

const router = express.Router();

// Public routes for home page
router.get("/search", searchProducts);
router.get("/categories/top", getTopCategories);
router.get("/flash-sale", getFlashSaleProducts);
router.get("/flash-sale/all", getAllFlashSaleProducts);
router.get("/best-selling", getBestSellingProducts);
router.get("/best-selling/all", getAllBestSellingProducts);
router.get("/featured", getFeaturedProducts);
router.get("/products", getAllProducts);
router.get("/category/products", getProductsByCategory);

export default router;
