const express = require("express");
const {
  getApplications,
  createApplication,
  updateApplication,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getApplications).post(protect, createApplication);
router.put("/:id", protect, adminOnly, updateApplication);

module.exports = router;
