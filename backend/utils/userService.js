const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/auth");

/**
 * Get all users
 * @returns {Promise<Array>} Array of users
 */
const getAllUsers = async () => {
  return await User.find({});
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Find user by username
 * @param {string} username - Username
 * @returns {Promise<Object|null>} User object or null
 */
const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} User object or null
 */
const findUserById = async (id) => {
  return await User.findById(id);
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
  const { username, email, password } = userData;
  const hashedPassword = await hashPassword(password);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  return await user.save();
};

/**
 * Update user password
 * @param {string} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Updated user
 */
const updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await hashPassword(newPassword);
  return await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
const deleteUser = async (userId) => {
  const result = await User.findByIdAndDelete(userId);
  return !!result;
};

/**
 * Validate user password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const validatePassword = async (password, hashedPassword) => {
  return await comparePassword(password, hashedPassword);
};

module.exports = {
  getAllUsers,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser,
  updateUserPassword,
  deleteUser,
  validatePassword,
};
