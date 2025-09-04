import express from "express";
import {
  createTablet,
  deleteTablet,
  getAllTablet,
  getTabletById,
  updateTablet,
} from "../controller/tablet.controller.js";
import { verifyLogin } from "../middleware/verifyLogin.js";

const router = express.Router();

router.post("/create", verifyLogin, createTablet);
router.get("/get-tablets", verifyLogin, getAllTablet);
router.get("/get-tablet-byId/:id", verifyLogin, getTabletById);
router.put("/update/:id", verifyLogin, updateTablet);
router.delete("/delete/:id", verifyLogin, deleteTablet);

export default router;
