import mongoose from "mongoose";

const tabletSchema = new mongoose.Schema(
  {
    loginUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    line: {
      type: String,
      required: true,
      trim: true,
    },
    tabletName: {
      type: String,
      required: true,
      trim: true,
    },
    modelNumber: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Tablet = mongoose.model("Tablet", tabletSchema);

export default Tablet;
