const express = require("express");
const router = express.Router();

const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus
} = require("../controllers/taskController");

// Admin-only delete
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteTask
);

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.patch("/:id/status", authMiddleware, updateTaskStatus);

module.exports = router;
