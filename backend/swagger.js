const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BinThere-DoneThat Authentication API",
      version: "1.0.0",
      description:
        "A secure JWT-based authentication API with user management capabilities",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and management",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
              example: "507f1f77bcf86cd799439011",
            },
            username: {
              type: "string",
              description: "Username",
              example: "johndoe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "john@example.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation date",
              example: "2024-01-01T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "User last update date",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        UserRegister: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 3,
              maxLength: 30,
              description: "Username (3-30 characters)",
              example: "johndoe",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "Password (minimum 6 characters)",
              example: "password123",
            },
          },
        },
        UserLogin: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              description: "User password",
              example: "password123",
            },
          },
        },
        PasswordUpdate: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: {
              type: "string",
              description: "Current password",
              example: "oldpassword",
            },
            newPassword: {
              type: "string",
              minLength: 6,
              description: "New password (minimum 6 characters)",
              example: "newpassword123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Login successful",
            },
            token: {
              type: "string",
              description: "JWT token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
              example: "Invalid credentials",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
              example: "Operation completed successfully",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./index.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
