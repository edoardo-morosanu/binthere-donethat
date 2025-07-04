const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Message ID
 *         name:
 *           type: string
 *           description: Sender's name
 *         email:
 *           type: string
 *           description: Sender's email address
 *         message:
 *           type: string
 *           description: Message content
 *         isAccepted:
 *           type: boolean
 *           description: Whether the message has been accepted/handled
 *         ipAddress:
 *           type: string
 *           description: IP address of the sender
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Message creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Message last update date
 */

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
contactMessageSchema.index({ isAccepted: 1 });
contactMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
