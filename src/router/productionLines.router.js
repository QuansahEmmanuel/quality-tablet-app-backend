import express from "express";
import {
  activeLines,
  addProductionLine,
  deleteProductionLine,
  getAllProductionLines,
  getProductionLineById,
  updateProductionLine,
} from "../controller/productionLines.controller.js";
import { verifyLogin } from "../middleware/verifyLogin.js";

const router = express.Router();

router.post("/create", verifyLogin, addProductionLine);
router.get("/get-lines", verifyLogin, getAllProductionLines);
router.get("/active-lines", verifyLogin, activeLines);
router.get("/get-line-byId/:id", verifyLogin, getProductionLineById);
router.put("/update/:id", verifyLogin, updateProductionLine);
router.delete("/delete/:id", verifyLogin, deleteProductionLine);

export default router;
