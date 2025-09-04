import ProductionLines from "../model/productionLines.model.js";

export const addProductionLine = async (req, res) => {
  try {
    const { line, status } = req.body;

    if (!line || !status) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const itExist = await ProductionLines.findOne({ line });
    if (itExist) {
      return res
        .status(400)
        .json({ success: false, message: "Line already exits" });
    }

    const newProductionLine = await ProductionLines.create({ line, status });
    res.status(201).json({
      success: true,
      message: "Production line added successfully",
      data: newProductionLine,
    });
  } catch (error) {
    console.error(`Error in addProductionLine: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllProductionLines = async (req, res) => {
  try {
    const data = await ProductionLines.find();
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error("Error in getAllProductionLines:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const activeLines = async (req, res) => {
  try {
    const data = await ProductionLines.find({ status: "ACTIVE" });
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error("Error in activeLines:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteProductionLine = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ProductionLines.findByIdAndDelete(id);
    res.status(200).json({
      message: "Production line deleted successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error in deleteProductionLine:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const updateProductionLine = async (req, res) => {
  const { id } = req.params;
  const { editLine, editStatus } = req.body;

  if (!editLine || !editStatus) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const productionLine = await ProductionLines.findById(id);
    if (!productionLine) {
      return res.status(404).json({ error: "Production line not found" });
    }

    productionLine.line = editLine;
    productionLine.status = editStatus;
    await productionLine.save();

    res.json({ message: "Production line updated successfully" });
  } catch (error) {
    console.error("Error in updateProductionLine:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

  // console.log(id, editLine, editStatus);
};

export const getProductionLineById = async (req, res) => {};
