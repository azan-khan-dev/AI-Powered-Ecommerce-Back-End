import express from "express";
import {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getOneCategory);

// Protected routes (require admin authentication)
router.post("/", isAdmin, singleUpload, createCategory);
router.put("/:id", isAdmin, singleUpload, updateCategory);
router.delete("/:id", isAdmin, deleteCategory);

export default router;
