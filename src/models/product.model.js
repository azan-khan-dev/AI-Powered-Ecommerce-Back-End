import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [{
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    }],
    is_flash_sale: {
      type: Boolean,
      default: false,
    },
    flash_sale_price: {
      type: Number,
      min: 0,
    },
    flash_sale_start: {
      type: Date,
    },
    flash_sale_end: {
      type: Date,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for better query performance
productSchema.index({ owner: 1, category: 1 });

export const Product = mongoose.model("Product", productSchema);
