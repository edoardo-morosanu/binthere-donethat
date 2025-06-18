const express = require("express");
const multer = require("multer");
const predictionController = require("../controllers/predictionController");
const {
  optionalAuthentication,
  authenticateToken,
} = require("../middleware/auth");

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
 *     summary: Upload file for prediction (JSON response)
 *     tags: [Prediction]
 *     security:
 *       - bearerAuth: []
 *     description: Authentication is optional. Returns object detection results.
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
 *                   type: string *                 
 *                 data:
 *                   type: object
 *                   description: Detection results from YOLO model
 *                   properties:
 *                     detections:
 *                       type: object
 *                       properties:
 *                         main_object:
 *                           type: object
 *                           properties:
 *                             class:
 *                               type: string
 *                               description: The predicted class of the main object
 *                             confidence:
 *                               type: number
 *                               description: The confidence score for the prediction
 *                             alternative_classifications:
 *                               type: array
 *                               description: List of alternative classifications for the detected object
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   class:
 *                                     type: string
 *                                     description: Alternative class name
 *                                   probability:
 *                                     type: number
 *                                     description: Probability score for the alternative class
 *                 filename:
 *                   type: string
 *       400:
 *         description: Bad request - no file or invalid file type
 *       500:
 *         description: Server error
 */
router.post(
  "/predict",
  optionalAuthentication,
  upload.single("file"),
  predictionController.predictFromFile
);

/**
 * @swagger
 * /api/prediction/predict-annotated:
 *   post:
 *     summary: Upload file for prediction (annotated image response)
 *     tags: [Prediction]
 *     security:
 *       - bearerAuth: []
 *     description: Authentication is optional. Returns annotated image with detection boxes.
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
 *         description: Prediction successful - returns annotated image or JSON if no objects detected
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Annotated image with detection boxes
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
 *                   nullable: true
 *                 filename:
 *                   type: string
 *       400:
 *         description: Bad request - no file or invalid file type
 *       500:
 *         description: Server error
 */
router.post(
  "/predict-annotated",
  optionalAuthentication,
  upload.single("file"),
  predictionController.predictAnnotatedFromFile
);

/**
 * @swagger
 * /api/prediction/disposal-confirmation:
 *   post:
 *     summary: Confirm disposal of waste item
 *     tags: [Prediction]
 *     security:
 *       - bearerAuth: []
 *     description: Confirm that user has disposed of the waste item according to AI recommendation. Must be called after making a prediction. Authentication is optional - if authenticated, increments user's prediction count.
 *     responses:
 *       200:
 *         description: Disposal confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object *
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 userItemsSortedCount:
 *                   type: integer
 *                   description: Updated total count of items successfully sorted by authenticated users only
 *       400:
 *         description: No recent prediction found - must make a prediction first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found (authenticated users only)
 *       500:
 *         description: Server error
 */
router.post(
  "/disposal-confirmation",
  optionalAuthentication,
  predictionController.confirmDisposal
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

/**
 * @swagger
 * /api/prediction/session-stats:
 *   get:
 *     summary: Get prediction session statistics
 *     tags: [Prediction]
 *     description: Returns statistics about active prediction sessions for monitoring purposes
 *     responses:
 *       200:
 *         description: Session statistics retrieved successfully
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
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of active sessions
 *                     withPredictions:
 *                       type: integer
 *                       description: Sessions that have made predictions
 *                     confirmed:
 *                       type: integer
 *                       description: Sessions that have confirmed disposal
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
router.get("/session-stats", predictionController.getSessionStats);

module.exports = router;
