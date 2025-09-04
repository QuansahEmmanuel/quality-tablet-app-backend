import mongoose from "mongoose";
import Tablet from "../model/tablet.model.js";

export const createTablet = async (req, res) => {
  try {
    const { line, tabletName, modelNumber, serialNumber } = req.body;

    // 1. Validate input
    if (!line || !tabletName || !modelNumber || !serialNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 2. Check if tablet already exists by serial number
    const existingTablet = await Tablet.findOne({ serialNumber });
    if (existingTablet) {
      return res.status(400).json({
        success: false,
        message: "Tablet with this serial number already exists",
      });
    }

    // 3. Create new tablet, link it with logged-in user
    const newTablet = await Tablet.create({
      loginUser: req.user._id, // this comes from verifyLogin middleware
      line,
      tabletName,
      modelNumber,
      serialNumber,
    });

    // 4. Send success response
    res.status(201).json({
      success: true,
      message: "Tablet registered successfully",
      data: newTablet,
    });
  } catch (error) {
    console.error(`Error in createTablet controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllTablet = async (req, res) => {
  try {
    const tablets = await Tablet.find()
      .populate("loginUser", "username email") // only include username + email from user
      .sort({ createdAt: -1 }); // newest first

    if (!tablets || tablets.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No tablets found" });
    }

    res.status(200).json({
      success: true,
      count: tablets.length,
      data: tablets,
    });
  } catch (error) {
    console.error(`Error in getAllTablet controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getTabletById = async (req, res) => {
  try {
    const { id } = req.params;

    // check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Tablet ID" });
    }

    // find tablet and include user details
    const tablet = await Tablet.findById(id).populate(
      "loginUser",
      "username email"
    );

    if (!tablet) {
      return res
        .status(404)
        .json({ success: false, message: "Tablet not found" });
    }

    res.status(200).json({ success: true, data: tablet });
  } catch (error) {
    console.error(`Error in getTabletById controller: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Tablet
export const updateTablet = async (req, res) => {
  try {
    const { id } = req.params;
    const { line, tabletName, modelNumber, serialNumber } = req.body;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Tablet ID" });
    }

    // Validate required fields
    if (!line || !tabletName || !modelNumber || !serialNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const updatedTablet = await Tablet.findByIdAndUpdate(
      id,
      { line, tabletName, modelNumber, serialNumber },
      { new: true } // return updated record
    );

    if (!updatedTablet) {
      return res
        .status(404)
        .json({ success: false, message: "Tablet not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Tablet updated successfully",
        data: updatedTablet,
      });
  } catch (error) {
    console.error(`Error in updateTablet: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete Tablet
export const deleteTablet = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Tablet ID" });
    }

    const deletedTablet = await Tablet.findByIdAndDelete(id);

    if (!deletedTablet) {
      return res
        .status(404)
        .json({ success: false, message: "Tablet not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Tablet deleted successfully" });
  } catch (error) {
    console.error(`Error in deleteTablet: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
