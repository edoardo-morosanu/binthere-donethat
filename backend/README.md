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
YOLO_API_URL=http://localhost:8000
YOLO_API_KEY=your-yolo-api-key-here
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

## 🤖 Prediction Endpoints

| Method | Endpoint                            | Description                                                  | Auth Required |
| ------ | ----------------------------------- | ------------------------------------------------------------ | ------------- |
| POST   | `/api/prediction/predict`           | Upload image for object detection (JSON response)            | Optional      |
| POST   | `/api/prediction/predict-annotated` | Upload image for object detection (annotated image response) | Optional      |
| POST   | `/api/prediction/confirm-disposal`  | Confirm disposal of waste item (increments user count)       | Required      |
| GET    | `/api/prediction/health`            | Check if YOLO service is available                           | No            |

### Prediction API Usage

The prediction endpoints connect to a YOLO machine learning service for waste object detection. Both prediction endpoints work without authentication, but when users are logged in and confirm disposal, their usage count is tracked.

**Workflow:**

1. User uploads image to `/predict` or `/predict-annotated`
2. AI analyzes image and returns classification
3. User reviews result and decides to dispose accordingly
4. User clicks "I Have Disposed" which calls `/confirm-disposal` (requires auth)
5. User's items sorted count is incremented for tracking purposes

**Supported file types**: JPEG, PNG, JPG, WEBP  
**Maximum file size**: 10MB

#### Authentication Benefits

- **Without login**: Full prediction functionality available
- **With login**:
  - Track total number of confirmed disposals via `/confirm-disposal` endpoint
  - Build usage statistics for environmental impact tracking

#### Items Sorted Count Tracking

When authenticated users confirm disposal of waste items (by calling `/confirm-disposal`), their items sorted count is incremented. This count represents the total number of times the user has successfully used the AI for waste classification and followed through with proper disposal.

**Example disposal confirmation:**

```bash
curl -X POST http://localhost:3001/api/prediction/confirm-disposal \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example response:**

```json
{
  "success": true,
  "message": "Disposal confirmed successfully",
  "userItemsSortedCount": 15
}
```

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

### Example Prediction Request:

```bash
# JSON response
curl -X POST http://localhost:3001/api/prediction/predict \
  -F "file=@path/to/your/image.jpg"

# Annotated image response
curl -X POST http://localhost:3001/api/prediction/predict-annotated \
  -F "file=@path/to/your/image.jpg" \
  --output annotated_result.jpg
```

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token authentication
- Input validation
- CORS enabled
- Environment variable configuration
- Error handling middleware

## 📝 Environment Variables

| Variable       | Description                    | Default                 |
| -------------- | ------------------------------ | ----------------------- |
| `NODE_ENV`     | Environment mode               | `development`           |
| `PORT`         | Server port                    | `3001`                  |
| `MONGODB_URI`  | MongoDB connection string      | Required                |
| `JWT_SECRET`   | JWT signing secret             | Required                |
| `YOLO_API_URL` | YOLO service URL               | `http://localhost:8000` |
| `YOLO_API_KEY` | API key for YOLO service       | Required                |
| `API_URL`      | API base URL for documentation | `http://localhost:3001` |

## 🤝 Contributing

1. Follow the project conventions in `CONVENTIONS.md`
2. Use feature branches for new functionality
3. Ensure all tests pass before submitting PRs
4. Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details.
