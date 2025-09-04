import mongoose from "mongoose";

// Sub-schema for issued items
const ItemSchema = new mongoose.Schema(
  {
    lineIssuedTo: { type: String, required: true },
    checkerId: { type: String, required: true },
    tabletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tablet",
      required: true,
    },
  },
  { timestamps: true }
);

// Main issuance schema
const IssuanceSchema = new mongoose.Schema(
  {
    transaction: { type: String, default: "issuance" },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    building: { type: String, required: true },
    shift: { type: String, required: true },
    items: [ItemSchema],
  },
  { timestamps: true }
);

const Issuance = mongoose.model("Issuance", IssuanceSchema);

export default Issuance;
