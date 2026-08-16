const express = require("express");
const {
  registerUser,
  registerAdmin,
  loginUser,
  getUserProfile,
  verifyIdentity,
  resetPassword,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-admin", protect, adminOnly, registerAdmin);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/verify-identity", verifyIdentity);
router.post("/reset-password", resetPassword);

module.exports = router;
