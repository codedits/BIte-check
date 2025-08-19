# Bite Check - Backend Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
MONGODB_URI=mongodb+srv://bitecheck123:bitecheck1234@cluster0.wnvoemk.mongodb.net/bitecheck?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3002
```

## Features Implemented

### ✅ Database & Models
- MongoDB Atlas connection with mongoose
- User model with email/password authentication
- Review model with user references and validation

### ✅ Authentication (NextAuth.js)
- Credentials provider for email/password login
- JWT-based sessions
- Password hashing with bcrypt
- Sign up and sign in API routes

### ✅ API Routes
- `/api/auth/[...nextauth]` - NextAuth configuration
- `/api/signup` - User registration
- `/api/reviews` - GET (all reviews) and POST (new review)

### ✅ Frontend Integration
- Authentication context and hooks
- Protected review submission
- User session management
- Responsive auth pages (signin/signup)

### ✅ Security Features
- Password hashing with bcrypt (12 salt rounds)
- Input validation and sanitization
- Protected API routes with session validation
- Email format validation

## Usage

1. **User Registration**: Visit `/auth/signup` to create an account
2. **User Login**: Visit `/auth/signin` to sign in
3. **Add Reviews**: Only authenticated users can submit reviews
4. **View Reviews**: All users can view reviews from the API

## Database Collections

- **users**: Email and hashed passwords
- **reviews**: User reviews with restaurant ratings and comments

## Next Steps for Production

1. Change `NEXTAUTH_SECRET` to a strong random string
2. Add rate limiting to API routes
3. Implement email verification
4. Add password reset functionality
5. Set up proper CORS policies
6. Add input sanitization middleware
7. Implement user roles and permissions
