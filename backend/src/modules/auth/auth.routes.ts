import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  verifyEmail,
  setNewPassword,
  getMe,
  logout,
  getAllUsers,
} from "./auth.controller";
import { authenticate } from "../../common/middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/set-new-password", setNewPassword);
router.get("/verify-email/:token", verifyEmail);
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.get("/admin/users", getAllUsers);

export default router;
