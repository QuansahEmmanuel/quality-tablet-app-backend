import TabletTransaction from "../model/tabletTransaction.model.js";
import Issuance from "../model/tabletIssuance.model.js";
import Collection from "../model/tabletCollection.model.js";

// Issue tablet
export const issueTablet = async (req, res) => {
  try {
    const { tabletId, checkerId, lineIssuedTo } = req.body;

    if (!tabletId || !checkerId || !lineIssuedTo) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const transaction = new TabletTransaction({
      tablet: tabletId,
      checker: checkerId,
      type: "ISSUED",
      lineIssuedTo,
      issuedBy: req.user._id,
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Tablet issued successfully",
      data: transaction,
    });
  } catch (error) {
    console.error(`Error in issueTablet: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Collect tablet
export const collectTablet = async (req, res) => {
  try {
    const { tabletId, checkerId, lineCollectedFrom } = req.body;

    if (!tabletId || !checkerId || !lineCollectedFrom) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const transaction = new TabletTransaction({
      tablet: tabletId,
      checker: checkerId,
      type: "COLLECTED",
      lineCollectedFrom,
      collectedBy: req.user._id,
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Tablet collected successfully",
      data: transaction,
    });
  } catch (error) {
    console.error(`Error in collectTablet: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all transactions (report)
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await TabletTransaction.find()
      .populate("tablet", "tabletName modelNumber serialNumber")
      .populate("checker", "username email")
      .populate("issuedBy", "username role")
      .populate("collectedBy", "username role")
      // .populate("createdBy", "username role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error(`Error in getAllTransactions: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get single transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await TabletTransaction.findById(id)
      .populate("tablet", "tabletName modelNumber serialNumber")
      .populate("checker", "username email")
      .populate("issuedBy", "username role")
      .populate("collectedBy", "username role");

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error(`Error in getTransactionById: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params; // transaction ID

    const transaction = await TabletTransaction.findByIdAndDelete(id);

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error(`Error in deleteTransaction: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
