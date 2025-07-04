const express = require("express");
const router = express.Router();
const {
  submitContactForm,
  getAllMessages,
  updateMessageStatus,
} = require("../controllers/contactController");
const { authenticateAdmin } = require("../middleware/auth");

// Contact form submission route (public)
router.post("/submit", submitContactForm);

// Get all contact messages (admin only - requires authentication + admin role)
router.get("/messages", authenticateAdmin, getAllMessages);

// Update message acceptance status (admin only - requires authentication + admin role)
router.patch("/messages/:id/accept", authenticateAdmin, updateMessageStatus);

module.exports = router;
