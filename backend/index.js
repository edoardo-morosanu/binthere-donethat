require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const { swaggerUi, specs } = require("./swagger");

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI", "YOLO_API_KEY"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.error("Please check your .env file");
  process.exit(1);
}

// Import routes
const authRoutes = require("./routes/auth");
const predictionRoutes = require("./routes/prediction");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Swagger Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "BinThere-DoneThat API Documentation",
  })
);

// Home route
app.get("/", (request, response) => {
  response.send(`
    <h1>BinThere-DoneThat API</h1>
    <p>Welcome to the BinThere-DoneThat API with AI-powered waste classification!</p>
    <p><a href="/api/docs">📚 View API Documentation</a></p>
  `);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/prediction", predictionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;

// For Vercel serverless functions, export the app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      `API Documentation available at http://localhost:${PORT}/api/docs`
    );
  });
}
