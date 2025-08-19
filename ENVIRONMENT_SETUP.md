# Environment Setup for Bite Check

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
MONGODB_URI=mongodb+srv://bitecheck123:bitecheck1234@cluster0.wnvoemk.mongodb.net/bitecheck?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
# Cloudinary (for image uploads)
# Use either explicit vars or CLOUDINARY_URL
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Optional: if you prefer a single URL
# CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

## Environment Variables Explanation

- **MONGODB_URI**: Connection string for MongoDB Atlas database
- **NEXTAUTH_SECRET**: Secret key for NextAuth.js JWT encryption (change in production)
- **NEXTAUTH_URL**: The base URL of your application (use your actual domain in production)
- **CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET**: Credentials for uploading images to Cloudinary. Generate from your Cloudinary dashboard.
- **CLOUDINARY_URL**: Alternative single URL format that encodes the same credentials. Optional if you set the explicit vars above.

## Setup Instructions

1. **Create the environment file**:
   ```bash
   # Create .env.local file in the root directory
   touch .env.local
   ```

2. **Add the environment variables** to the `.env.local` file using the values above

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## Database Setup

The application uses MongoDB Atlas with the following collections:
- **users**: User accounts with email and hashed passwords
- **restaurants**: Restaurant information with ratings and reviews
- **reviews**: User reviews linked to restaurants

## Authentication

The application uses NextAuth.js with:
- Credentials provider for email/password authentication
- JWT-based sessions
- Password hashing with bcrypt
- Protected API routes

## Features Working

✅ User registration and login
✅ Restaurant creation and management
✅ Review system with ratings
✅ Search and filtering functionality
✅ Responsive design with modern UI
✅ Real-time data updates via event bus
✅ Protected routes and API endpoints

## Production Considerations

1. Change `NEXTAUTH_SECRET` to a strong random string
2. Update `NEXTAUTH_URL` to your production domain
3. Consider using environment-specific MongoDB connections
4. Add rate limiting to API routes
5. Implement proper CORS policies
6. Add input sanitization middleware
