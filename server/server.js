const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");

dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// AUTHENTICATION ROUTES
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// QUEUE ROUTES
// Authentication is handled
// inside queueRoutes.js
// ===============================

app.use("/api/queue", queueRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Digital Queue Management API is running",
  });
});

// ===============================
// PROTECTED TEST ROUTE
// ===============================

const protect = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});