import mongoose from "mongoose";

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      index: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Index for better query performance
categorySchema.index({ title: 1 });

export const Category = mongoose.model("Category", categorySchema);
