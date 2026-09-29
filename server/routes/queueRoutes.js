const express = require("express");

const router = express.Router();

const {
  createToken,
  getQueue,
  getMyTokens,
  updateQueueStatus,
} = require("../controllers/queueController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// ==============================
// PROTECT ALL QUEUE ROUTES
// ==============================

router.use(protect);

// ==============================
// USER QUEUE ROUTES
// ==============================

router.post("/", createToken);

router.get("/", getQueue);

router.get("/my", getMyTokens);

// ==============================
// ADMIN QUEUE ROUTE
// ==============================

router.put(
  "/:id/status",
  adminOnly,
  updateQueueStatus
);

module.exports = router;