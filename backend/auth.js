const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// User Schema for MongoDB
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find user by username
const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

// Find user by ID
const findUserById = async (id) => {
  return await User.findById(id);
};

// Create new user
const createUser = async (userData) => {
  const hashedPassword = await hashPassword(userData.password);

  const newUser = new User({
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
  });

  return await newUser.save();
};

// Update user password
const updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await hashPassword(newPassword);

  return await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
};

// Delete user
const deleteUser = async (userId) => {
  const result = await User.findByIdAndDelete(userId);
  return !!result;
};

// Get all users (without passwords)
const getAllUsers = async () => {
  return await User.find({}, { password: 0 });
};

module.exports = {
  generateToken,
  authenticateToken,
  hashPassword,
  comparePassword,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser,
  updateUserPassword,
  deleteUser,
  getAllUsers,
  User, // Export the model for direct access if needed
};
