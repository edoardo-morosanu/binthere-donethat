const axios = require("axios");
const FormData = require("form-data");

class PredictionService {
  constructor() {
    this.predictionApiUrl = "http://localhost:8000/predict";
  }

  /**
   * Send a file to the prediction API
   * @param {Buffer} fileBuffer - The file buffer to send
   * @param {string} filename - The original filename
   * @param {string} mimetype - The file MIME type
   * @returns {Promise<Object>} The prediction response
   */
  async predictFromFile(fileBuffer, filename, mimetype) {
    try {
      const formData = new FormData();
      formData.append("file", fileBuffer, {
        filename: filename,
        contentType: mimetype,
      });

      const response = await axios.post(this.predictionApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          // Don't manually set Content-Type, let FormData handle it
        },
        timeout: 30000, // 30 second timeout
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        responseType: "arraybuffer", // Since FastAPI returns image bytes
      });

      // Check if response is JSON (no objects detected case)
      const contentType = response.headers["content-type"] || "";
      if (contentType.includes("application/json")) {
        const jsonData = JSON.parse(response.data.toString());
        return {
          success: true,
          isJson: true,
          data: jsonData,
          status: response.status,
        };
      }

      // Handle image response (annotated image)
      return {
        success: true,
        isJson: false,
        imageBuffer: Buffer.from(response.data),
        contentType: contentType,
        status: response.status,
      };
    } catch (error) {
      console.error("Prediction API Error:", error.message);

      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          error: error.response.data || "Prediction API returned an error",
          status: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error:
            "Prediction API is not responding. Please check if the service is running on localhost:8000",
          status: 503,
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: "Failed to make prediction request",
          status: 500,
        };
      }
    }
  }
  /**
   * Health check for the prediction API
   * @returns {Promise<boolean>} True if API is healthy
   */
  async healthCheck() {
    try {
      // Check if the YOLO API is reachable by hitting the docs endpoint (FastAPI provides this automatically)
      const response = await axios.get("http://localhost:8000/docs", {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.warn("Prediction API health check failed:", error.message);
      return false;
    }
  }
}

module.exports = new PredictionService();
