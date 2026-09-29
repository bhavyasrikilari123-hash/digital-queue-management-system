const Queue = require("../models/Queue");

// ==============================
// CREATE QUEUE TOKEN
// ==============================

const createToken = async (req, res) => {
  try {
    const { customerName, service } = req.body;

    if (!customerName || !service) {
      return res.status(400).json({
        message: "Customer name and service are required",
      });
    }

    const lastToken = await Queue.findOne().sort({
      tokenNumber: -1,
    });

    const nextTokenNumber = lastToken
      ? lastToken.tokenNumber + 1
      : 1;

    const queue = await Queue.create({
      tokenNumber: nextTokenNumber,
      customerName,
      service,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Token generated successfully",
      queue,
    });
  } catch (error) {
    console.error("CREATE TOKEN ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==============================
// GET ALL QUEUE
// ==============================

const getQueue = async (req, res) => {
  try {
    const queue = await Queue.find()
      .populate("user", "name email")
      .sort({ tokenNumber: 1 });

    res.json({
      queue,
    });
  } catch (error) {
    console.error("GET QUEUE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==============================
// GET MY TOKENS
// ==============================

const getMyTokens = async (req, res) => {
  try {
    const queue = await Queue.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    // App.jsx expects "queue"
    res.json({
      queue,
    });
  } catch (error) {
    console.error("GET MY TOKENS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==============================
// UPDATE QUEUE STATUS
// ==============================

const updateQueueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "waiting",
      "serving",
      "completed",
      "skipped",
    ];

    // Check valid status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // ==============================
    // ONLY ONE CUSTOMER CAN BE SERVING
    // ==============================

    if (status === "serving") {
      const alreadyServing = await Queue.findOne({
        status: "serving",
        _id: { $ne: req.params.id },
      });

      if (alreadyServing) {
        return res.status(409).json({
          message:
            "Another customer is already being served. Complete the current token first.",
        });
      }
    }

    // ==============================
    // UPDATE STATUS
    // ==============================

    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!queue) {
      return res.status(404).json({
        message: "Queue token not found",
      });
    }

    res.json({
      message: "Queue status updated successfully",
      queue,
    });
  } catch (error) {
    console.error("UPDATE QUEUE STATUS ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==============================
// EXPORT
// ==============================

module.exports = {
  createToken,
  getQueue,
  getMyTokens,
  updateQueueStatus,
};