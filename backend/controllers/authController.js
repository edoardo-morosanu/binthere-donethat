const userService = require("../utils/userService");
const { generateToken } = require("../utils/auth");

/**
 * Get all users (admin endpoint)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    if (await userService.findUserByEmail(email)) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    if (await userService.findUserByUsername(username)) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Create user
    const newUser = await userService.createUser({ username, email, password });
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await userService.validatePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      itemsSortedCount: user.itemsSortedCount || 0,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update user password
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }

    // Find user
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isValidPassword = await userService.validatePassword(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password
    await userService.updateUserPassword(user._id, newPassword);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete current user
 */
const deleteCurrentUser = async (req, res) => {
  try {
    const success = await userService.deleteUser(req.user.id);
    if (!success) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("User deletion error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  register,
  login,
  getCurrentUser,
  updatePassword,
  deleteCurrentUser,
};
