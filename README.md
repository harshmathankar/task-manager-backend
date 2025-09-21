# Task Manager Backend

A robust Node.js/Express API for the Task Manager application with MongoDB integration.

## What This Is

## 🏗️ System Architecture

### Technology Stack
- **Runtime**: Node.js (JavaScript runtime)
- **Framework**: Express.js (web application framework)
- **Database**: MongoDB (NoSQL document database)
- **ODM**: Mongoose (MongoDB object modeling)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs (password hashing)
- **Validation**: express-validator (input validation)
- **Environment Management**: dotenv (environment variables)
- **CORS**: Cross-Origin Resource Sharing support

### Project Structure & File Organization

```
task-manager-backend/
├── server.js                    # 🚀 Main application entry point
├── package.json                 # 📦 Dependencies and project metadata
├── package-lock.json           # 🔒 Dependency version lock
├── .env                        # 🔐 Environment variables (sensitive data)
├── .gitignore                  # 🚫 Git ignore patterns
├── README.md                   # 📖 Project documentation
└── src/                        # 📁 Source code directory
    ├── config/                 # ⚙️ Configuration files
    │   ├── db.js              # 🗄️ Database connection setup
    │   └── authConfig.js      # 🔑 JWT authentication configuration
    ├── controllers/           # 🎮 Business logic controllers
    │   ├── authController.js  # 👤 User authentication logic
    │   └── taskController.js  # ✅ Task management logic
    ├── middleware/            # 🛡️ Request processing middleware
    │   └── authMiddleware.js  # 🔐 JWT token verification
    ├── models/               # 📊 Database schemas and models
    │   ├── User.js          # 👥 User data model
    │   └── Task.js          # 📝 Task data model
    └── routes/              # 🛣️ API endpoint definitions
        ├── authRoutes.js    # 🔑 Authentication endpoints
        └── taskRoutes.js    # ✅ Task management endpoints
```

## 📊 Database Schema & Data Models

### User Model (`src/models/User.js`)
**Purpose**: Stores user account information with secure password handling

```javascript
{
  username: String,     // Unique identifier, 3-30 chars, trimmed
  email: String,        // Unique email, validated format, lowercase
  password: String,     // Hashed with bcrypt (salt rounds: 12)
  createdAt: Date,      // Auto-generated timestamp
  updatedAt: Date       // Auto-updated timestamp
}
```

**Security Features**:
- Password auto-hashing before database save
- Email format validation with regex
- Username uniqueness enforcement
- Password comparison method for authentication

### Task Model (`src/models/Task.js`)
**Purpose**: Stores individual task data linked to users

```javascript
{
  title: String,        // Required, max 200 chars, trimmed
  description: String,  // Optional, max 1000 chars, trimmed
  completed: Boolean,   // Default: false
  priority: String,     // Enum: ['low', 'medium', 'high'], default: 'medium'
  dueDate: Date,        // Optional due date
  user: ObjectId,       // Reference to User model (required)
  createdAt: Date,      // Auto-generated timestamp
  updatedAt: Date       // Auto-updated timestamp
}
```

**Performance Optimizations**:
- Index on `user + completed` for filtered queries
- Index on `user + createdAt` for sorted queries

## 🔐 Authentication & Security System

### JWT Token Flow
1. **Registration/Login** → Server generates JWT token
2. **Client Storage** → Client stores token (localStorage/sessionStorage)
3. **API Requests** → Client sends token in Authorization header
4. **Server Validation** → Middleware verifies token on protected routes
5. **Access Control** → User data attached to request object

### Security Implementation Details
- **Password Hashing**: bcrypt with 12 salt rounds
- **Token Expiration**: Configurable (default: 7 days)
- **Token Secret**: Environment variable (JWT_SECRET)
- **Input Validation**: express-validator on all inputs
- **Error Handling**: Sanitized error messages in production

## 🛣️ API Endpoints & Data Flow

### Authentication Endpoints (`/api/auth`)

#### `POST /api/auth/register`
**Purpose**: Create new user account

**Request Flow**:
1. Validate input (username, email, password)
2. Check for existing user (email/username)
3. Hash password with bcrypt
4. Save user to database
5. Generate JWT token
6. Return token + user data (excluding password)

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 201)**:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/login`
**Purpose**: Authenticate existing user

**Request Flow**:
1. Validate input (email, password)
2. Find user by email
3. Compare password with stored hash
4. Generate JWT token
5. Return token + user data

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### `GET /api/auth/me`
**Purpose**: Get current authenticated user data
**Authentication**: Required (JWT token)

**Request Flow**:
1. Verify JWT token (middleware)
2. Extract user ID from token
3. Fetch user data from database
4. Return user information (excluding password)

### Task Management Endpoints (`/api/tasks`)

#### `GET /api/tasks`
**Purpose**: Retrieve user's tasks with filtering and sorting
**Authentication**: Required

**Query Parameters**:
- `completed`: Filter by completion status (true/false)
- `priority`: Filter by priority (low/medium/high)
- `sort`: Sort field (default: -createdAt for newest first)

**Request Flow**:
1. Verify JWT token
2. Build MongoDB filter object
3. Apply user-specific filter (user: req.user._id)
4. Apply optional filters (completed, priority)
5. Execute database query with sorting
6. Return tasks array with count

**Example Request**: `GET /api/tasks?completed=false&priority=high&sort=-dueDate`

**Response**:
```json
{
  "message": "Tasks retrieved successfully",
  "count": 3,
  "tasks": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Complete project proposal",
      "description": "Finalize the Q4 project proposal",
      "completed": false,
      "priority": "high",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "user": "64f8a1b2c3d4e5f6a7b8c9d0",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

#### `POST /api/tasks`
**Purpose**: Create new task
**Authentication**: Required

**Request Flow**:
1. Verify JWT token
2. Validate input data
3. Add user ID to task data
4. Save task to database
5. Return created task

**Request Body**:
```json
{
  "title": "Review code changes",
  "description": "Review PR #123 for security updates",
  "priority": "medium",
  "dueDate": "2024-01-20T00:00:00.000Z"
}
```

#### `GET /api/tasks/:id`
**Purpose**: Retrieve specific task by ID
**Authentication**: Required

**Request Flow**:
1. Verify JWT token
2. Find task by ID and user ownership
3. Return task data or 404 if not found/not owned

#### `PUT /api/tasks/:id`
**Purpose**: Update existing task
**Authentication**: Required

**Request Flow**:
1. Verify JWT token
2. Validate input data
3. Find task by ID and user ownership
4. Update task fields
5. Save changes to database
6. Return updated task

**Updatable Fields**: title, description, completed, priority, dueDate

#### `DELETE /api/tasks/:id`
**Purpose**: Delete task
**Authentication**: Required

**Request Flow**:
1. Verify JWT token
2. Find task by ID and user ownership
3. Delete task from database
4. Return success message

## 🔧 Configuration & Environment

### Environment Variables (`.env`)
```bash
# Server Configuration
NODE_ENV=development          # Environment mode (development/production)
PORT=5000                     # Server port number

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager  # MongoDB connection string

# JWT Authentication
JWT_SECRET=your_super_secure_secret_key_here        # JWT signing secret
JWT_EXPIRE=7d                                       # Token expiration time
```

### Dependencies (`package.json`)
```json
{
  "dependencies": {
    "express": "^4.18.2",           # Web framework
    "mongoose": "^7.5.0",          # MongoDB ODM
    "bcryptjs": "^2.4.3",          # Password hashing
    "jsonwebtoken": "^9.0.2",      # JWT token handling
    "express-validator": "^7.0.1",  # Input validation
    "cors": "^2.8.5",              # Cross-origin requests
    "dotenv": "^16.3.1"            # Environment variables
  },
  "devDependencies": {
    "nodemon": "^3.0.1"            # Development auto-restart
  }
}
```

## 🚀 Application Startup & Server Configuration

### Main Server File (`server.js`)
**Purpose**: Application entry point and server configuration

**Startup Sequence**:
1. **Environment Setup**: Load `.env` variables
2. **Database Connection**: Connect to MongoDB
3. **Express App Creation**: Initialize Express application
4. **Middleware Setup**: Configure CORS, JSON parsing, URL encoding
5. **Route Registration**: Mount authentication and task routes
6. **Error Handling**: Global error and 404 handlers
7. **Server Start**: Listen on specified port

**Middleware Stack**:
- `cors()`: Enable cross-origin requests
- `express.json({ limit: '10mb' })`: Parse JSON bodies (10MB limit)
- `express.urlencoded({ extended: true })`: Parse URL-encoded bodies

**Health Check Endpoint**: `GET /api/health`
- Returns server status and timestamp
- Used for monitoring and load balancer health checks

## 🛡️ Middleware & Security

### Authentication Middleware (`src/middleware/authMiddleware.js`)
**Purpose**: Verify JWT tokens on protected routes

**Process Flow**:
1. Extract token from Authorization header (`Bearer <token>`)
2. Verify token signature and expiration
3. Decode user ID from token payload
4. Fetch user data from database
5. Attach user object to request (`req.user`)
6. Continue to next middleware/controller

**Error Handling**:
- Missing token → 401 Unauthorized
- Invalid token → 401 Unauthorized
- Expired token → 401 Unauthorized
- User not found → 401 Unauthorized

## 📝 Input Validation & Error Handling

### Validation Rules
**User Registration**:
- Username: 3-30 characters, alphanumeric + underscore
- Email: Valid email format, lowercase conversion
- Password: Minimum 6 characters

**Task Creation/Update**:
- Title: Required, maximum 200 characters
- Description: Optional, maximum 1000 characters
- Priority: Must be 'low', 'medium', or 'high'
- Due Date: Valid date format

### Error Response Format
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email",
      "value": "invalid-email"
    }
  ]
}
```

## 🔄 Data Flow Examples

### Complete User Registration Flow
1. **Client Request**: POST /api/auth/register with user data
2. **Validation**: express-validator checks input format
3. **Duplicate Check**: Query database for existing email/username
4. **Password Hashing**: bcrypt hashes password with salt
5. **Database Save**: Mongoose saves user document
6. **Token Generation**: JWT created with user ID
7. **Response**: Return token and user data to client
8. **Client Storage**: Client stores token for future requests

### Task Creation with Authentication
1. **Client Request**: POST /api/tasks with Authorization header
2. **Token Verification**: Middleware validates JWT token
3. **User Extraction**: User ID extracted from token payload
4. **Input Validation**: express-validator checks task data
5. **Data Enrichment**: Add user ID to task object
6. **Database Save**: Mongoose saves task document
7. **Response**: Return created task to client

## 🚀 Setup & Development

### Installation Steps
```bash
# 1. Clone repository
git clone https://github.com/harshmathankar/task-manager-backend.git
cd task-manager-backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 4. Start MongoDB (if running locally)
mongod

# 5. Start development server
npm run dev
```

### Available Scripts
- `npm start`: Production server start
- `npm run dev`: Development server with auto-restart
- `npm test`: Run test suite (placeholder)

### Development Workflow
1. **Code Changes**: Modify source files
2. **Auto Restart**: nodemon detects changes and restarts server
3. **API Testing**: Use Postman/curl to test endpoints
4. **Database Inspection**: Use MongoDB Compass or CLI
5. **Git Workflow**: Commit changes and push to repository

## 🔍 Troubleshooting & Common Issues

### Database Connection Issues
- Verify MongoDB is running
- Check MONGODB_URI in .env file
- Ensure network connectivity

### Authentication Problems
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Ensure token hasn't expired

### Validation Errors
- Check request body format
- Verify required fields are present
- Ensure data types match schema

## 📈 Performance Considerations

### Database Optimization
- Indexes on frequently queried fields
- Pagination for large result sets
- Connection pooling via Mongoose

### Security Best Practices
- Environment variables for sensitive data
- Password hashing with sufficient salt rounds
- JWT token expiration
- Input validation and sanitization
- CORS configuration

## 🔮 Future Enhancements

- **Rate Limiting**: Prevent API abuse
- **Caching**: Redis for session management
- **File Uploads**: Task attachments
- **Real-time Updates**: WebSocket integration
- **Email Notifications**: Task reminders
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Unit and integration tests
- **Logging**: Structured logging with Winston

This documentation serves as a comprehensive guide for developers, AI agents, and RAG systems to understand, modify, and extend the task manager backend application.
