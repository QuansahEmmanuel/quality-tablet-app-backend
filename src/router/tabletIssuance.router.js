import exress from "express";
import { verifyLogin } from "../middleware/verifyLogin.js";
import {
  addItemToIssuance,
  getAllIssuanceItems,
  getIssuanceById,
  startIssuance,
  deleteItem,
  deleteItems,
} from "../controller/tabletIssuance.controller.js";

const router = exress.Router();

router.post("/startIssuance", verifyLogin, startIssuance);
router.post("/addItemToIssuance", verifyLogin, addItemToIssuance);
router.get("/issuance/:id", verifyLogin, getIssuanceById);
router.get("/issuance-items/:id", verifyLogin, getAllIssuanceItems);
router.delete("/deleteItem/:issuanceId/:itemId", verifyLogin, deleteItem);
router.delete("/deleteItems/:issuanceId", verifyLogin, deleteItems);

export default router;
