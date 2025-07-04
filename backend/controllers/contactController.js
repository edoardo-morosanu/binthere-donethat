const ContactMessage = require("../models/ContactMessage");

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           description: The sender's name
 *         email:
 *           type: string
 *           format: email
 *           description: The sender's email address
 *         message:
 *           type: string
 *           description: The message content
 */

/**
 * @swagger
 * /api/contact/submit:
 *   post:
 *     summary: Submit a contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       200:
 *         description: Message received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thank you for your message! We have received your email and will contact you shortly."
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required"
 *       500:
 *         description: Internal server error
 */

const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "All fields are required",
        success: false,
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address",
        success: false,
      });
    }

    // Get IP address
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim();

    // Save the contact message to the database
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      ipAddress,
    });

    await contactMessage.save();

    console.log("Contact form submission saved:", {
      id: contactMessage._id,
      name,
      email,
      timestamp: contactMessage.createdAt,
      ip: ipAddress,
    });

    // Return success response
    res.status(200).json({
      message:
        "Thank you for your message! We have received your email and will contact you shortly.",
      success: true,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
      success: false,
    });
  }
};

/**
 * @swagger
 * /api/contact/messages:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contact]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of messages per page
 *       - in: query
 *         name: isAccepted
 *         schema:
 *           type: boolean
 *         description: Filter by acceptance status
 *     responses:
 *       200:
 *         description: List of contact messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContactMessage'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalMessages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       500:
 *         description: Internal server error
 */
const getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.isAccepted !== undefined) {
      filter.isAccepted = req.query.isAccepted === "true";
    }

    // Get messages with pagination
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalMessages = await ContactMessage.countDocuments(filter);
    const totalPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
      success: false,
    });
  }
};

/**
 * @swagger
 * /api/contact/messages/{id}/accept:
 *   patch:
 *     summary: Update message acceptance status
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isAccepted
 *             properties:
 *               isAccepted:
 *                 type: boolean
 *                 description: Whether the message is accepted
 *     responses:
 *       200:
 *         description: Message status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message status updated successfully"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 contactMessage:
 *                   $ref: '#/components/schemas/ContactMessage'
 *       400:
 *         description: Bad request - invalid message ID or missing isAccepted field
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAccepted } = req.body;

    // Validate required fields
    if (typeof isAccepted !== "boolean") {
      return res.status(400).json({
        error: "isAccepted field is required and must be a boolean",
        success: false,
      });
    }

    // Validate message ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Invalid message ID format",
        success: false,
      });
    }

    // Update the message
    const contactMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { isAccepted },
      { new: true }
    );

    if (!contactMessage) {
      return res.status(404).json({
        error: "Message not found",
        success: false,
      });
    }

    console.log(
      `Message ${id} status updated to ${isAccepted ? "accepted" : "pending"}`
    );

    res.status(200).json({
      message: "Message status updated successfully",
      success: true,
      contactMessage,
    });
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({
      error: "Internal server error. Please try again later.",
      success: false,
    });
  }
};

module.exports = {
  submitContactForm,
  getAllMessages,
  updateMessageStatus,
};
