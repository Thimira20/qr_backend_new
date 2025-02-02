// routes/userDataRoutes.js
const express = require("express");
const {
  getUserData,
  createUserData,
} = require("../controllers/userDataController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getUserData); // Changed route to root
router.post("/", protect, createUserData); // Changed route to root

module.exports = router;
