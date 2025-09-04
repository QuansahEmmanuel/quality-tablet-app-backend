import express from "express";
import {
  collectTablet,
  deleteTransaction,
  getAllTransactions,
  getTransactionById,
  issueTablet,
} from "../controller/tabletTransaction.controller.js";
import { verifyLogin } from "../middleware/verifyLogin.js";

const router = express.Router();

router.post("/issue", verifyLogin, issueTablet);
router.post("/collect", verifyLogin, collectTablet);
router.get("/report", verifyLogin, getAllTransactions);
router.get("/report/:id", verifyLogin, getTransactionById);
router.delete("/delete/:id", verifyLogin, deleteTransaction);

export default router;
