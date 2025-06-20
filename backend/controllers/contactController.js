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

    // Log the contact form submission (in a real app, you'd save this to a database or send an email)
    console.log("Contact form submission received:", {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress,
    });

    // In a production environment, you might want to:
    // 1. Save the message to a database
    // 2. Send an email notification to your team
    // 3. Send an auto-reply email to the user
    // 4. Apply rate limiting to prevent spam

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

module.exports = {
  submitContactForm,
};
