import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOneOrder,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Client-side routes
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOneOrder);
router.put("/:id/cancel", cancelOrder);

// Admin-only routes
router.get("/admin/all", isAdmin, getAllOrders);
router.put("/:id/status", isAdmin, updateOrderStatus);

export default router;
