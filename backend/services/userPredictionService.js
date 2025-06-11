const User = require("../models/User");

class UserPredictionService {
  /**
   * Increment items sorted count for a user
   * @param {string} userId - The user ID
   * @returns {Promise<number>} The updated items sorted count
   */
  async incrementItemsSortedCount(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { itemsSortedCount: 1 } },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user.itemsSortedCount;
    } catch (error) {
      console.error("Error incrementing items sorted count:", error);
      throw error;
    }
  }

  /**
   * Get items sorted count for a user
   * @param {string} userId - The user ID
   * @returns {Promise<number>} The user's items sorted count
   */
  async getUserItemsSortedCount(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      return user.itemsSortedCount;
    } catch (error) {
      console.error("Error getting items sorted count:", error);
      throw error;
    }
  }
}

module.exports = new UserPredictionService();
