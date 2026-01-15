import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  checkWishlistStatus,
} from "../controllers/wishlist.controller.js";

const router = Router();

// Apply auth middleware to all routes
router.use(isAuthenticated);

// Add product to wishlist
router.post("/add", addToWishlist);

// Remove product from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// Get user's wishlist
router.get("/", getUserWishlist);

// Check if product is in wishlist
router.get("/check/:productId", checkWishlistStatus);

export default router;