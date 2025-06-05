const predictionService = require("../services/predictionService");

class PredictionController {
  /**
   * Handle file upload and prediction
   */
  async predictFromFile(req, res) {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded. Please provide a file.",
        });
      }

      const { buffer, originalname, mimetype } = req.file;

      // Validate file type (optional - you can customize this)
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid file type. Please upload an image file (JPEG, PNG, JPG, WEBP).",
        });
      } // Call prediction service
      const result = await predictionService.predictFromFile(
        buffer,
        originalname,
        mimetype
      );

      if (result.success) {
        if (result.isJson) {
          // Return JSON response (e.g., "No objects detected")
          return res.status(200).json({
            success: true,
            message: result.data.message || "Prediction completed",
            data: result.data,
            filename: originalname,
          });
        } else {
          // Return the annotated image directly
          res.set({
            "Content-Type": result.contentType,
            "Content-Disposition": `inline; filename="annotated_${originalname}"`,
          });
          return res.send(result.imageBuffer);
        }
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
}

module.exports = new PredictionController();
