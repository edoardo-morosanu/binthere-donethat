# BinThere-DoneThat Backend Architecture

## 📋 Overview

The backend has been restructured from a monolithic single-file approach to a modular, maintainable architecture following the **MVC (Model-View-Controller)** pattern and **separation of concerns** principles.

## 🏗️ Architecture Pattern

This backend follows a **layered architecture** with clear separation between:

- **Presentation Layer** (Routes)
- **Business Logic Layer** (Controllers & Services)
- **Data Access Layer** (Models & Database)
- **Infrastructure Layer** (Middleware, Utils, Config)

## 📁 Detailed File Structure

```
backend/
├── 📁 config/                    # Configuration files
│   └── database.js               # MongoDB connection setup
├── 📁 controllers/               # Business logic handlers
│   └── authController.js         # Authentication business logic
├── 📁 middleware/                # Custom middleware functions
│   └── auth.js                   # JWT authentication middleware
├── 📁 models/                    # Database schemas and models
│   └── User.js                   # User model with Mongoose schema
├── 📁 routes/                    # API route definitions
│   └── auth.js                   # Authentication API routes
├── 📁 utils/                     # Utility functions and services
│   ├── auth.js                   # JWT and password utilities
│   ├── userService.js            # User-related database operations
│   └── validation.js             # Input validation utilities
├── index.js                      # Main application entry point
├── swagger.js                    # API documentation configuration
├── package.json                  # Dependencies and scripts
├── README.md                     # Backend-specific documentation
├── .env.example                  # Environment variables template
└── auth.js.backup               # Backup of original monolithic file
```

## 🔧 Component Details

### 🗂️ Configuration Layer (`config/`)

#### `database.js`

- **Purpose**: Centralized database connection management
- **Responsibilities**:
  - MongoDB connection setup
  - Connection error handling
  - Database configuration
- **Key Functions**:
  - `connectDB()`: Establishes MongoDB connection

### 🎮 Controllers Layer (`controllers/`)

#### `authController.js`

- **Purpose**: Business logic for authentication operations
- **Responsibilities**:
  - Request/response handling
  - Input validation
  - Business rule enforcement
  - Error handling
- **Key Functions**:
  - `getAllUsers()`: Retrieve all users (admin)
  - `register()`: User registration logic
  - `login()`: User authentication logic
  - `getCurrentUser()`: Get authenticated user info
  - `updatePassword()`: Password update logic
  - `deleteCurrentUser()`: Account deletion logic

### 🛡️ Middleware Layer (`middleware/`)

#### `auth.js`

- **Purpose**: Authentication and authorization middleware
- **Responsibilities**:
  - JWT token validation
  - Request authentication
  - User authorization
- **Key Functions**:
  - `authenticateToken()`: Validates JWT tokens on protected routes

### 🗃️ Models Layer (`models/`)

#### `User.js`

- **Purpose**: User data model and schema definition
- **Responsibilities**:
  - Database schema definition
  - Data validation rules
  - Model methods
- **Features**:
  - Mongoose schema with validation
  - Automatic timestamp generation
  - Password exclusion from JSON output
  - Unique constraints on username and email

### 🛤️ Routes Layer (`routes/`)

#### `auth.js`

- **Purpose**: API endpoint definitions and routing
- **Responsibilities**:
  - Route definitions
  - Middleware application
  - Swagger documentation
  - Controller method binding
- **Endpoints**:
  - `GET /users`: Get all users
  - `POST /register`: User registration
  - `POST /login`: User login
  - `GET /me`: Get current user
  - `PUT /password`: Update password
  - `DELETE /me`: Delete account

### 🔧 Utilities Layer (`utils/`)

#### `auth.js`

- **Purpose**: Authentication-related utility functions
- **Responsibilities**:
  - JWT token generation and verification
  - Password hashing and comparison
- **Key Functions**:
  - `generateToken()`: Creates JWT tokens
  - `verifyToken()`: Validates JWT tokens
  - `hashPassword()`: Hashes passwords with bcrypt
  - `comparePassword()`: Compares passwords

#### `userService.js`

- **Purpose**: User data access and business operations
- **Responsibilities**:
  - Database operations
  - User CRUD operations
  - Business logic for user management
- **Key Functions**:
  - `getAllUsers()`: Fetch all users
  - `findUserByEmail()`: Find user by email
  - `findUserByUsername()`: Find user by username
  - `findUserById()`: Find user by ID
  - `createUser()`: Create new user
  - `updateUserPassword()`: Update user password
  - `deleteUser()`: Delete user
  - `validatePassword()`: Validate user password

#### `validation.js`

- **Purpose**: Input validation and sanitization
- **Responsibilities**:
  - Data validation
  - Input sanitization
  - Validation rules enforcement
- **Key Functions**:
  - `isValidEmail()`: Email format validation
  - `isValidUsername()`: Username format validation
  - `validatePassword()`: Password strength validation
  - `sanitizeInput()`: Input sanitization
  - `validateRegistrationData()`: Complete registration validation

### 📄 Application Layer

#### `index.js`

- **Purpose**: Main application entry point and server setup
- **Responsibilities**:
  - Express app configuration
  - Middleware setup
  - Route mounting
  - Server initialization
  - Error handling
- **Features**:
  - Database connection initialization
  - CORS configuration
  - Swagger documentation setup
  - Global error handling
  - 404 route handler

#### `swagger.js`

- **Purpose**: API documentation configuration
- **Responsibilities**:
  - Swagger/OpenAPI configuration
  - Schema definitions
  - Documentation generation
- **Features**:
  - Complete API documentation
  - Request/response schemas
  - Authentication documentation
  - Interactive API explorer

## 🔄 Data Flow

```
Client Request
     ↓
Express Router (routes/auth.js)
     ↓
Authentication Middleware (middleware/auth.js) [if protected]
     ↓
Controller (controllers/authController.js)
     ↓
Validation (utils/validation.js)
     ↓
Service Layer (utils/userService.js)
     ↓
Model (models/User.js)
     ↓
Database (MongoDB)
     ↓
Response back through the chain
```

## 🎯 Benefits of This Architecture

### 1. **Separation of Concerns**

- Each file has a single, well-defined responsibility
- Easy to locate and modify specific functionality
- Reduced coupling between components

### 2. **Maintainability**

- Code is organized logically
- Easy to add new features without affecting existing code
- Clear structure for debugging and testing

### 3. **Scalability**

- Easy to add new models, controllers, and routes
- Modular structure allows for team collaboration
- Can be easily extended with additional features

### 4. **Testability**

- Each component can be tested independently
- Mock dependencies easily for unit testing
- Clear interfaces between layers

### 5. **Reusability**

- Utility functions can be reused across the application
- Services can be shared between different controllers
- Middleware can be applied to multiple routes

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive validation and sanitization
- **Error Handling**: Secure error responses without sensitive data exposure
- **CORS Configuration**: Cross-origin request handling

## 📝 Environment Configuration

The application uses environment variables for configuration:

- `NODE_ENV`: Environment mode
- `PORT`: Server port
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: JWT signing secret
- `API_URL`: API base URL

## 🚀 Getting Started

1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Copy `.env.example` to `.env`
3. **Start Development**: `npm run dev`
4. **Access Documentation**: `http://localhost:3001/api/docs`

## 📚 API Documentation

- **Swagger UI**: Interactive API documentation
- **Comprehensive Schemas**: Request/response documentation
- **Authentication Examples**: JWT token usage examples
- **Error Responses**: Detailed error response documentation

This architecture provides a solid foundation for building scalable, maintainable web applications with clear separation of concerns and industry best practices.
