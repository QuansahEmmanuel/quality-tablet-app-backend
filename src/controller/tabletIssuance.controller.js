import Issuance from "../model/tabletIssuance.model.js";

// Start a new issuance transaction
export const startIssuance = async (req, res) => {
  try {
    const { building, shift } = req.body;

    if (!building || !shift) {
      return res
        .status(400)
        .json({ success: false, message: "Building and shift are required" });
    }

    const issuance = new Issuance({
      transaction: "ISSUANCE",
      issuedBy: req.user._id,
      building,
      shift,
      items: [], // start empty
    });

    await issuance.save();

    res.status(201).json({
      success: true,
      message: "Issuance started successfully",
      issuanceId: issuance._id,
      data: issuance,
    });
  } catch (error) {
    console.error("Error in startIssuance:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Add an item to an existing issuance by scanning
export const addItemToIssuance = async (req, res) => {
  try {
    const { issuanceId, tabletId, checkerId, lineIssuedTo } = req.body;

    if (!issuanceId || !tabletId || !checkerId || !lineIssuedTo) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const issuance = await Issuance.findById(issuanceId);
    if (!issuance) {
      return res
        .status(404)
        .json({ success: false, message: "Issuance not found" });
    }

    // Push item into items array
    issuance.items.push({
      tabletId,
      checkerId,
      lineIssuedTo,
    });

    await issuance.save();

    res.status(200).json({
      success: true,
      message: "Tablet successfully issued",
      data: issuance,
    });
  } catch (error) {
    console.error("Error in addItemToIssuance:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getIssuanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const issuance = await Issuance.findById(id);
    if (!issuance) {
      return res
        .status(404)
        .json({ success: false, message: "Issuance not found" });
    }

    res.status(200).json({ success: true, data: issuance });
  } catch (error) {
    console.error("Error in getIssuanceById:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// export const getAllIssuanceItems = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       res
//         .status(400)
//         .json({ success: false, message: "Issuance ID is required" });
//     }
//     const issuance = await Issuance.findById(id);
//     if (!issuance) {
//       res.status(404).json({ success: false, message: "Issuance not found" });
//     }
//     res.status(200).json({ success: true, data: issuance.items });
//   } catch (error) {
//     console.error("Error in getAllIssuanceItems:", error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

export const getAllIssuanceItems = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Issuance ID is required" });
    }

    const issuance = await Issuance.findById(id)
      .populate({
        path: "items.tabletId", // populate tablet details
        select: "tabletName modelNumber serialNumber line", // choose fields you want
      })
      .populate({
        path: "issuedBy", // optional, if you want user details too
        select: "name email",
      });

    if (!issuance) {
      return res
        .status(404)
        .json({ success: false, message: "Issuance not found" });
    }

    res.status(200).json({ success: true, data: issuance });
  } catch (error) {
    console.error("Error in getAllIssuanceItems:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Example backend route handlers
export const deleteItem = async (req, res) => {
  try {
    const { issuanceId, itemId } = req.params;
    const issuance = await Issuance.findById(issuanceId);
    issuance.items = issuance.items.filter(
      (item) => item._id.toString() !== itemId
    );
    await issuance.save();
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete item" });
  }
};

export const deleteItems = async (req, res) => {
  try {
    const { issuanceId } = req.params;
    const { itemIds } = req.body;
    const issuance = await Issuance.findById(issuanceId);
    issuance.items = issuance.items.filter(
      (item) => !itemIds.includes(item._id.toString())
    );
    await issuance.save();
    res.json({ success: true, message: "Items deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete items" });
  }
};
