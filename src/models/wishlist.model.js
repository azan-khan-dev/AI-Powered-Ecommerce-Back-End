import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate wishlist entries
wishlistSchema.index({ customer: 1, product: 1 }, { unique: true });

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);