import { stripeWebhook } from "../controllers/stripe-webhook.controller.js";
import { Router } from "express";
const router = Router();


router.post("/", stripeWebhook);

export default router;