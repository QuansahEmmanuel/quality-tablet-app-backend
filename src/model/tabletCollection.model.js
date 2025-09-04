import mongoose from "mongoose";

// Sub-schema for collected items
const CollectedItemSchema = new mongoose.Schema(
  {
    lineCollectedFrom: { type: String, required: true },
    checkerId: { type: String, required: true },
    tabletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tablet",
      required: true,
    },
  },
  { timestamps: true }
);

// Main collection schema
const CollectionSchema = new mongoose.Schema(
  {
    transaction: { type: String, default: "collection" }, // fixed as "collection"
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    building: { type: String, required: true },
    shift: { type: String, required: true },
    items: [CollectedItemSchema],
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", CollectionSchema);

export default Collection;
