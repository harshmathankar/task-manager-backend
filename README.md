# Task Manager Backend

A robust Node.js/Express API for the Task Manager application with MongoDB integration.

## What This Is
This backend provides a RESTful API for user authentication and task management. It handles user registration/login with JWT tokens and provides full CRUD operations for tasks.

## Why This Architecture
- **Express.js**: Fast, minimalist web framework for Node.js
- **MongoDB with Mongoose**: NoSQL database for flexible task storage
- **JWT Authentication**: Stateless authentication for scalability
- **MVC Pattern**: Separation of concerns for maintainability
- **Input Validation**: Data integrity with express-validator
- **Error Handling**: Consistent error responses

## How It Works

### Authentication Flow
1. User registers/logs in → JWT token generated
2. Token stored on client → Sent in Authorization header
3. Middleware validates token → User ID extracted for requests

### Database Structure
- **Users**: Username, email, hashed password
- **Tasks**: Title, description, priority, due date, completion status
- **Relationships**: Each task belongs to a user

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/tasks` - Get user's tasks (with filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # OR use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

4. **Run the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Security Features
- Password hashing with bcrypt
- JWT token expiration
- Input validation and sanitization
- CORS enabled for cross-origin requests
- Protected routes with middleware

## Error Handling
- Validation errors return specific field issues
- Authentication errors return appropriate HTTP codes
- Server errors are logged and return generic messages in production
