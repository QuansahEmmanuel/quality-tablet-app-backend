import express from "express";
import {
  authCheck,
  deleteUser,
  getAllUsers,
  getUserByID,
  registerUser,
  updateUser,
  userLogin,
  userLogout,
} from "../controller/user.controller.js";
import { verifyLogin } from "../middleware/verifyLogin.js";

const router = express.Router();

router.post("/register", verifyLogin, registerUser);
router.post("/login", userLogin);
router.post("/logout", userLogout);
router.get("/check", verifyLogin, authCheck);

router.get("/users", verifyLogin, getAllUsers);
router.get("/user/:id", verifyLogin, getUserByID);
router.put("/update-user/:id", verifyLogin, updateUser);
router.delete("/delete-user/:id", verifyLogin, deleteUser);

export default router;
