// routes/userDataRoutes.js
const express = require("express");
const {
  getUserData,
  createUserData,
  deleteAllExceptAdmin,
  updateUserRoles,
  deleteSelectedUsers,
  getAllUsers,
} = require("../controllers/userDataController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getUserData); // Changed route to root
router.post("/", protect, createUserData); // Changed route to root



router.get("/users", protect, getAllUsers);
router.put("/users/update-roles", protect, updateUserRoles);
router.delete("/users/delete-selected", protect, deleteSelectedUsers);
router.delete("/users/delete-all-except-admin", protect, deleteAllExceptAdmin);

module.exports = router;
