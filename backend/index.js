require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const { swaggerUi, specs } = require("./swagger");

// Import routes
const authRoutes = require("./routes/auth");

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
    <h1>BinThere-DoneThat Authentication API</h1>
    <p>Welcome to the authentication API!</p>
    <p><a href="/api/docs">📚 View API Documentation</a></p>
  `);
});

// Routes
app.use("/api/auth", authRoutes);

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api/docs`
  );
});
