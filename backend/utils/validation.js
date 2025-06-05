/**
 * Validation utilities for user input
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} True if username is valid
 */
const isValidUsername = (username) => {
  if (!username || typeof username !== "string") return false;
  if (username.length < 3 || username.length > 30) return false;

  // Allow letters, numbers, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and errors
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password || typeof password !== "string") {
    errors.push("Password is required");
    return { isValid: false, errors };
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }

  // Optional: Add more password strength requirements
  // if (!/(?=.*[a-z])/.test(password)) {
  //   errors.push('Password must contain at least one lowercase letter');
  // }

  // if (!/(?=.*[A-Z])/.test(password)) {
  //   errors.push('Password must contain at least one uppercase letter');
  // }

  // if (!/(?=.*\d)/.test(password)) {
  //   errors.push('Password must contain at least one number');
  // }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize user input by trimming whitespace
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim();
};

/**
 * Validate user registration data
 * @param {object} userData - User data to validate
 * @returns {object} Validation result
 */
const validateRegistrationData = (userData) => {
  const errors = [];
  const { username, email, password } = userData;

  // Validate username
  if (!isValidUsername(username)) {
    errors.push(
      "Username must be 3-30 characters long and contain only letters, numbers, underscores, and hyphens"
    );
  }

  // Validate email
  if (!isValidEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  isValidEmail,
  isValidUsername,
  validatePassword,
  sanitizeInput,
  validateRegistrationData,
};
