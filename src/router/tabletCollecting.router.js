import express from "express";
import { verifyLogin } from "../middleware/verifyLogin.js";
import {
  startCollection,
  addItemToCollection,
  getCollectionById,
  getAllCollectionItems,
  deleteItem,
  deleteItems,
} from "../controller/tabletCollection.controller.js";

const router = express.Router();

// Collection routes with authentication middleware
router.post("/startCollection", verifyLogin, startCollection);
router.post("/addItemToCollection", verifyLogin, addItemToCollection);
router.get("/collection/:id", verifyLogin, getCollectionById);
router.get("/collection-items/:id", verifyLogin, getAllCollectionItems);
router.delete("/deleteItem/:collectionId/:itemId", verifyLogin, deleteItem);
router.delete("/deleteItems/:collectionId", verifyLogin, deleteItems);

export default router;
