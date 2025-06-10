const predictionService = require("../services/predictionService");
const userPredictionService = require("../services/userPredictionService");
const {
  trackPrediction,
  canConfirmDisposal,
  confirmDisposal,
  getSessionStats,
} = require("../middleware/predictionSession");

class PredictionController {
  constructor() {
    // Bind all methods to preserve 'this' context
    this.predictFromFile = this.predictFromFile.bind(this);
    this.predictAnnotatedFromFile = this.predictAnnotatedFromFile.bind(this);
    this.confirmDisposal = this.confirmDisposal.bind(this);
    this.healthCheck = this.healthCheck.bind(this);
    this.getSessionStats = this.getSessionStats.bind(this);
  }

  // Common validation method
  _validateFile(req, res) {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded. Please provide a file.",
      });
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid file type. Please upload an image file (JPEG, PNG, JPG, WEBP).",
      });
      return false;
    }

    return true;
  }

  /**
   * Handle file upload and prediction (JSON response)
   */
  async predictFromFile(req, res) {
    try {
      if (!this._validateFile(req, res)) return;

      const { buffer, originalname, mimetype } = req.file;
      const result = await predictionService.predictFromFile(
        buffer,
        originalname,
        mimetype
      );
      if (result.success) {
        // Track successful prediction for disposal confirmation
        trackPrediction(req);

        return res.status(200).json({
          success: true,
          message: result.noObjectsDetected
            ? result.message
            : "Prediction completed successfully",
          data: result.noObjectsDetected ? null : result.data,
          filename: originalname,
        });
      } else {
        return res.status(result.status || 500).json({
          success: false,
          message: result.error || "Prediction failed",
          filename: originalname,
        });
      }
    } catch (error) {
      console.error("Prediction Controller Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during prediction",
      });
    }
  }
  /**
   * Handle file upload and prediction (annotated image response)
   */
  async predictAnnotatedFromFile(req, res) {
    try {
      if (!this._validateFile(req, res)) return;

      const { buffer, originalname, mimetype } = req.file;
      const result = await predictionService.predictAnnotatedFromFile(
        buffer,
        originalname,
        mimetype
      );
      if (result.success) {
        if (result.noObjectsDetected) {
          return res.status(200).json({
            success: true,
            message: result.message,
            data: null,
            filename: originalname,
          });
        }

        // Track successful prediction for disposal confirmation
        trackPrediction(req);

        // Return the annotated image directly
        res.set({
          "Content-Type": result.contentType,
          "Content-Disposition": `inline; filename="annotated_${originalname}"`,
        });
        return res.send(result.imageBuffer);
      } else {
        return res.status(result.status || 500).json({
          success: false,
          message: result.error || "Prediction failed",
          filename: originalname,
        });
      }
    } catch (error) {
      console.error("Prediction Annotated Controller Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during prediction",
      });
    }
  }
  /**
   * Handle disposal confirmation - increment user's prediction count if authenticated
   */
  async confirmDisposal(req, res) {
    try {
      // Check if user has made a prediction and can confirm disposal
      if (!canConfirmDisposal(req)) {
        return res.status(400).json({
          success: false,
          message:
            "No recent prediction found. Please make a prediction before confirming disposal.",
        });
      }

      // Mark disposal as confirmed to prevent abuse
      confirmDisposal(req);

      // Check if user is authenticated
      if (req.user) {
        // User is logged in - increment their counter
        try {
          const itemsSortedCount =
            await userPredictionService.incrementItemsSortedCount(req.user.id);

          return res.status(200).json({
            success: true,
            message: "Disposal confirmed successfully",
            userItemsSortedCount: itemsSortedCount,
          });
        } catch (error) {
          console.error("Failed to update items sorted count:", error);
          if (error.message === "User not found") {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }

          // If counter update fails, still confirm disposal but without count
          return res.status(200).json({
            success: true,
            message: "Disposal confirmed successfully (counter update failed)",
          });
        }
      } else {
        // User is not logged in - just confirm disposal without counter
        return res.status(200).json({
          success: true,
          message: "Disposal confirmed successfully",
        });
      }
    } catch (error) {
      console.error("Disposal Confirmation Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during disposal confirmation",
      });
    }
  }
  /**
   * Check if prediction API is available
   */
  async healthCheck(req, res) {
    try {
      const isHealthy = await predictionService.healthCheck();

      return res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        message: isHealthy
          ? "Prediction API is healthy"
          : "Prediction API is not available",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Health Check Error:", error);
      return res.status(500).json({
        success: false,
        message: "Health check failed",
      });
    }
  }

  /**
   * Get session statistics for monitoring
   */
  async getSessionStats(req, res) {
    try {
      const stats = getSessionStats();
      return res.status(200).json({
        success: true,
        message: "Session statistics retrieved successfully",
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Session Stats Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve session statistics",
      });
    }
  }
}

module.exports = new PredictionController();
