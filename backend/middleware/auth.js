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

module.exports = { authenticateToken, optionalAuthentication };
