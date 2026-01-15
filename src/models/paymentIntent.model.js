import mongoose from "mongoose";

const paymentIntentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  intentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export const PaymentIntent = mongoose.model("PaymentIntent", paymentIntentSchema);