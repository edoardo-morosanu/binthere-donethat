const { verifyToken } = require("../utils/auth");

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

/**
 * Optional authentication middleware - doesn't block if no token is provided
 * but rejects invalid tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const optionalAuthentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      console.error("Invalid token in optional authentication:", error.message);
      return res.status(403).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
  }
  // If no token provided, continue without setting req.user

  next();
};

/**
 * Middleware to check if authenticated user is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const requireAdmin = (req, res, next) => {
  // Get admin emails from environment variable (comma-separated)
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((email) =>
      email.trim().toLowerCase()
    ) || [];

  if (adminEmails.length === 0) {
    console.error(
      "No admin emails configured in ADMIN_EMAILS environment variable"
    );
    return res.status(500).json({
      error: "Admin access not configured",
      success: false,
    });
  }

  const userEmail = req.user?.email?.toLowerCase();

  if (!userEmail || !adminEmails.includes(userEmail)) {
    return res.status(403).json({
      error: "Admin access required",
      success: false,
    });
  }

  next();
};

/**
 * Combined middleware: authenticate token AND check admin status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return;
    requireAdmin(req, res, next);
  });
};

module.exports = {
  authenticateToken,
  optionalAuthentication,
  requireAdmin,
  authenticateAdmin,
};
