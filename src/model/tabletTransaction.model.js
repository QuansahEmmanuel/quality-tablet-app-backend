import mongoose from "mongoose";

const tabletTransactionSchema = new mongoose.Schema(
  {
    tablet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tablet",
      required: true,
    },
    checker: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["ISSUED", "COLLECTED"],
      required: true,
    },
    lineIssuedTo: {
      type: String,
      trim: true,
    },
    lineCollectedFrom: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "ISSUED";
      },
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "COLLECTED";
      },
    },
  },
  { timestamps: true }
);

const TabletTransaction = mongoose.model(
  "TabletTransaction",
  tabletTransactionSchema
);

export default TabletTransaction;
