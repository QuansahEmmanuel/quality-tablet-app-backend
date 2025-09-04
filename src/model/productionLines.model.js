import mongoose from "mongoose";

const productionLinesSchema = new mongoose.Schema(
  {
    line: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      required: true,
    },
  },
  { timestamps: true }
);

const ProductionLines = mongoose.model(
  "ProductionLines",
  productionLinesSchema
);

export default ProductionLines;
