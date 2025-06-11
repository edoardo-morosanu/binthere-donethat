const axios = require("axios");
const FormData = require("form-data");

class PredictionService {
  constructor() {
    this.baseUrl = process.env.YOLO_API_URL || "http://localhost:8000";
    this.apiKey = process.env.YOLO_API_KEY;

    if (!this.apiKey) {
      console.warn("YOLO_API_KEY not found in environment variables");
    }
  }

  /**
   * Send a file to the prediction API (JSON response)
   */
  async predictFromFile(fileBuffer, filename, mimetype) {
    return this._sendPredictionRequest(
      `${this.baseUrl}/predict`,
      fileBuffer,
      filename,
      mimetype,
      "json"
    );
  }

  /**
   * Send a file to the prediction API (annotated image response)
   */
  async predictAnnotatedFromFile(fileBuffer, filename, mimetype) {
    return this._sendPredictionRequest(
      `${this.baseUrl}/predict_annotated`,
      fileBuffer,
      filename,
      mimetype,
      "image"
    );
  }

  /**
   * Internal method to send prediction requests
   * @private
   */ async _sendPredictionRequest(
    url,
    fileBuffer,
    filename,
    mimetype,
    expectedResponseType
  ) {
    try {
      if (!this.apiKey) {
        throw new Error(
          "YOLO API key is not configured. Please set YOLO_API_KEY in your .env file."
        );
      }

      const formData = new FormData();
      formData.append("file", fileBuffer, { filename, contentType: mimetype });

      const response = await axios.post(url, formData, {
        headers: { ...formData.getHeaders(), "x-api-key": this.apiKey },
        timeout: 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        responseType: expectedResponseType === "image" ? "arraybuffer" : "json",
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 204,
      });

      // Handle 204 No Content (no objects detected)
      if (response.status === 204) {
        return {
          success: true,
          noObjectsDetected: true,
          message: "No objects detected in the image",
          status: 204,
        };
      }

      // Handle JSON response
      if (expectedResponseType === "json") {
        return {
          success: true,
          data: response.data,
          status: response.status,
        };
      }

      // Handle image response
      return {
        success: true,
        imageBuffer: Buffer.from(response.data),
        contentType: response.headers["content-type"] || "image/jpeg",
        status: response.status,
      };
    } catch (error) {
      console.error("Prediction API Error:", error.message);

      if (error.response) {
        return {
          success: false,
          error:
            error.response.data?.detail ||
            error.response.data ||
            "Prediction API returned an error",
          status: error.response.status,
        };
      }

      if (error.request) {
        return {
          success: false,
          error: `Prediction API is not responding. Please check if the YOLO service is running on ${this.baseUrl}`,
          status: 503,
        };
      }

      return {
        success: false,
        error: error.message || "Failed to make prediction request",
        status: 500,
      };
    }
  }
  /**
   * Health check for the prediction API
   * @returns {Promise<boolean>} True if API is healthy
   */
  async healthCheck() {
    try {
      // Check if the YOLO API is reachable by hitting the docs endpoint (FastAPI provides this automatically)
      const response = await axios.get(`${this.baseUrl}/docs`, {
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
