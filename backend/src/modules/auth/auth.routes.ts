import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  setNewPassword,
  changePassword,
  getMe,
  logout,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAdminStats,
} from "./auth.controller";
import { authenticate, authorizeAdmin } from "../../common/middleware";

const router = Router();

// Public Auth Endpoints
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/set-new-password", setNewPassword);

// Protected User Endpoints
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.post("/change-password", authenticate, changePassword);

// Admin-Only Endpoints
router.get("/admin/stats", authenticate, authorizeAdmin, getAdminStats);
router.get("/admin/users", authenticate, authorizeAdmin, getAllUsers);
router.put("/admin/users/:id", authenticate, authorizeAdmin, updateUserStatus);
router.delete("/admin/users/:id", authenticate, authorizeAdmin, deleteUser);

export default router;
