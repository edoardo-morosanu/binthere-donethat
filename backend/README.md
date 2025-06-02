# BinThere-DoneThat Backend API

A secure JWT-based authentication API built with Node.js, Express, and MongoDB.

## 🚀 Features

- User registration and authentication
- JWT token-based security
- Password hashing with bcrypt
- MongoDB database integration
- Comprehensive API documentation with Swagger
- Input validation and error handling
- Modular architecture following MVC pattern

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
│   └── database.js   # Database connection
├── controllers/      # Route handlers and business logic
│   └── authController.js
├── middleware/       # Custom middleware
│   └── auth.js      # Authentication middleware
├── models/          # Database models
│   └── User.js      # User model
├── routes/          # API routes
│   └── auth.js      # Authentication routes
├── utils/           # Utility functions
│   ├── auth.js      # JWT and password utilities
│   └── userService.js # User service functions
├── index.js         # Main application file
├── swagger.js       # Swagger configuration
└── package.json     # Dependencies and scripts
```

## 🛠️ Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/binthere-donethat
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:3001/api/docs
- **API Base URL**: http://localhost:3001/api

## 🔐 Authentication Endpoints

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login user            |
| GET    | `/api/auth/me`       | Get current user info |
| PUT    | `/api/auth/password` | Update password       |
| DELETE | `/api/auth/me`       | Delete user account   |
| GET    | `/api/auth/users`    | Get all users (admin) |

## 🧪 Testing

The API can be tested using:

- Swagger UI interface
- Postman or similar API testing tools
- curl commands

### Example Registration Request:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token authentication
- Input validation
- CORS enabled
- Environment variable configuration
- Error handling middleware

## 📝 Environment Variables

| Variable      | Description                    | Default                 |
| ------------- | ------------------------------ | ----------------------- |
| `NODE_ENV`    | Environment mode               | `development`           |
| `PORT`        | Server port                    | `3001`                  |
| `MONGODB_URI` | MongoDB connection string      | Required                |
| `JWT_SECRET`  | JWT signing secret             | Required                |
| `API_URL`     | API base URL for documentation | `http://localhost:3001` |

## 🤝 Contributing

1. Follow the project conventions in `CONVENTIONS.md`
2. Use feature branches for new functionality
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details.
