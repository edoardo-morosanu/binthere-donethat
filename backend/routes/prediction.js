const express = require("express");
const multer = require("multer");
const predictionController = require("../controllers/predictionController");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as buffers
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow image files
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."), false);
    }
  },
});

/**
 * @swagger
 * /api/prediction/predict:
 *   post:
 *     summary: Upload file for prediction
 *     tags: [Prediction]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to analyze
 *     responses:
 *       200:
 *         description: Prediction successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 filename:
 *                   type: string
 *       400:
 *         description: Bad request - no file or invalid file type
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/predict",
  upload.single("file"),
  predictionController.predictFromFile
);

/**
 * @swagger
 * /api/prediction/health:
 *   get:
 *     summary: Check prediction API health
 *     tags: [Prediction]
 *     responses:
 *       200:
 *         description: Prediction API is healthy
 *       503:
 *         description: Prediction API is not available
 */
router.get("/health", predictionController.healthCheck);

module.exports = router;
