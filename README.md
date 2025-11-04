# 🍽️ Bite Check - Restaurant Rating App

A modern, beautiful restaurant rating and review platform built with Next.js, TailwindCSS, and Framer Motion. Features a stunning dark theme with glass morphism effects and smooth animations.

## ✨ Features

- **Modern Dark UI**: Beautiful dark theme with glass morphism effects
- **Responsive Design**: Works perfectly on mobile and desktop
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Restaurant Discovery**: Browse and search restaurants by cuisine, location, and price
- **Review System**: Rate restaurants and read user reviews
- **Interactive Components**: Hover effects, smooth transitions, and modern UX

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS with custom glass effects
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Language**: TypeScript
- **Styling**: Custom CSS with glass morphism utilities
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: NextAuth.js with JWT sessions
- **Security**: bcrypt for password hashing

## 🎨 Design Features

- **Glass Morphism**: Beautiful translucent containers with backdrop blur
- **Dark Theme**: Elegant dark color scheme with accent colors
# 🍽️ Bite Check - Restaurant Rating App

A modern restaurant rating and review platform built with Next.js (App Router), TailwindCSS, Framer Motion and MongoDB.

This README focuses on the backend logic (models, APIs, auth and image upload flow) and the main frontend structure and components used to interact with the backend.

## Table of contents
- Overview
- Architecture
- Backend: Models & Schemas
- Backend: Key API endpoints
- Authentication
- Image upload flow (Cloudinary)
- Frontend structure & important components
- Environment variables
- Local development & testing
- Notes & next steps

## Overview

The app stores restaurants and user reviews in MongoDB via Mongoose models. Reviews may include multiple images (stored as arrays of image URLs). A Cloudinary-backed upload endpoint is used to store images and return a hosted `secure_url` which is saved on each `Review` document.

## Architecture

- Next.js app (app directory, React client components)
- API routes implemented under `app/api/*` (server runtime)
- Mongoose models under `models/`
- Authentication using NextAuth (Credentials provider) with JWT strategy
- Image uploads handled by a server-side Cloudinary uploader at `/api/review-upload`

## Backend: Models & Schemas

The following Mongoose models exist (fields trimmed to essentials):

- `models/Review.js` (Review)
  - userId: ObjectId (ref 'User') — required
  - username: String — required
  - restaurant: String — required
  - rating: Number (1-5) — required
  - comment: String (trimmed, max 500) — required
  - images: [String] — array of image URLs (default: [])
  - rating_breakdown: { taste, presentation, service, ambiance, value } — optional per-category scores (1-5)
  - timestamps: createdAt, updatedAt
  - Indexes: { userId, createdAt }, { restaurant, createdAt }, { createdAt }, and a compound index including `images.0` to speed image-based lookups

- `models/Restaurant.js` (Restaurant)
  - name: String — required
  - cuisine: String — required
  - location: String — required
  - priceRange: String — one of ['$', '$$', '$$$', '$$$$']
  - description: String
  - addedBy: ObjectId (ref 'User') — required
  - rating: Number (avg rating)
  - totalReviews: Number
  - image: String (main image URL)
  - imageThumb: String (thumbnail)
  - imageBlur: String (base64 tiny image for blur placeholder)
  - featured: Boolean
  - timestamps and several performance indexes (unique name+location, featured, rating sorting, full-text index for search)

- `models/User.js` (User)
  - email: String — required, unique index
  - password: String — hashed (bcrypt)
  - timestamps

Notes:
- Reviews hold the authoritative image URLs for review photos (an array of strings). Images are uploaded to Cloudinary and the returned `secure_url` is stored in `Review.images`.

## Backend: Key API endpoints

All API code lives under `app/api/*`.

1) `POST /api/review-upload`
   - Purpose: Upload a single image to Cloudinary and return a hosted URL.
   - Request: JSON body { file: string } where `file` is a Data URL (e.g. `data:image/jpeg;base64,...`) or a remote http(s) URL.
   - Response: 200 { secure_url: string } or error 4xx/5xx.
   - Notes: Uses Cloudinary SDK server-side. The endpoint verifies Cloudinary config and returns helpful diagnostic info on errors.

2) `GET /api/reviews`
   - Query params: `userId`, `restaurant` (optional filters)
   - Response: JSON array of reviews (sorted by createdAt desc). Each review may include `images` array.

3) `POST /api/reviews` (auth required)
   - Body: { restaurant, rating, comment, images?: string[], rating_breakdown?: {...} }
   - Behavior: Validates input, creates a new Review (user taken from session), saves images array (if provided), increments/updates Restaurant rating and totalReviews (creates or updates restaurant record as needed), and returns the created review.
   - Response: 201 { message, review }

4) `PATCH /api/reviews` (auth required)
   - Body: { id, rating?, comment?, images?, rating_breakdown?, restaurantName?, restaurantLocation? }
   - Behavior: Verifies ownership, updates review fields. For images, the API accepts a complete array and replaces the review's images with the provided array (server-side limits to 6). If restaurant name/location change, it attempts to update/migrate restaurant metadata.

5) `DELETE /api/reviews?id=<id>` (auth required)
   - Behavior: Verifies ownership, attempts to delete Cloudinary resources for the review (if Cloudinary config present), deletes the review, and recalculates or deletes the associated restaurant record depending on remaining reviews.

Error handling: API routes return JSON error messages and appropriate HTTP status codes. Authentication is enforced via NextAuth server session checks for modifying routes.

## Authentication

- Implemented in `lib/auth.js` using NextAuth with multiple providers:
  - **Credentials Provider**: Email & password authentication with bcrypt hashing
  - **Google OAuth 2.0**: Sign in with Google account
- Both providers connect to MongoDB and create/update user records
- Session strategy: JWT (`session.strategy = 'jwt'`) with callbacks adding `user.id`, `user.username`, and `provider` into the token/session
- Pages: `signIn` and `signUp` configured under `/auth/*` routes with support for both credential and Google OAuth flows
- Google OAuth users are automatically created in the database on first sign-in

## Image upload flow (Cloudinary)

1. Client selects files and the client code (e.g. `AddReviewModal`, `EditReviewModal`) reads each file as a Data URL using FileReader.
2. For each file the client calls `POST /api/review-upload` with body `{ file: dataUrl }`.
3. The API uploads to Cloudinary using the server SDK; the endpoint returns `{ secure_url }`.
4. Client collects the returned secure URLs and sends them as part of the review payload to `POST /api/reviews` or `PATCH /api/reviews`.

Server-side deletion: When a review is deleted, the `DELETE /api/reviews` handler tries to extract Cloudinary `public_id` from stored image URLs and call Cloudinary API to remove those resources (if Cloudinary credentials are present).

## Frontend structure & important components

Key files and components (high level):

- `app/` — Next.js app router pages and API routes. Notable pages:
  - `app/explore/page.tsx` — Explore restaurants listing
  - `app/restaurant/[id]/page.tsx` — Restaurant detail and reviews

- `components/`
  - `SimpleRestaurantCard.tsx` — Card used in explore grids
  - `AddReviewModal.tsx` — Modal with category ratings, comment, image preview + upload flow
  - `EditReviewModal.tsx` — Edit modal that shows existing review images, allows marking them for removal, and adding new images (uploads to `/api/review-upload` before saving)
  - `ImageCarousel.tsx` — Reusable carousel + lightbox used for review galleries and restaurant images
  - `CloudImage.tsx` — Lightweight wrapper / optimized image helper used throughout (abstracts image rendering)
  - `ReviewList.tsx` / `ReviewDetailModal.tsx` — Use the carousel to display review images

Integration notes:
- `AddReviewModal` and `EditReviewModal` create client-side previews using `URL.createObjectURL` and revoke them on close.
- Both modals upload selected images to `/api/review-upload` (data URL) and only store returned `secure_url` values in the review document.
- `ImageCarousel` provides thumbnails, next/prev controls, and a fullscreen lightbox.

## Environment variables

Provide these in `.env.local` (example names used in code):

- `MONGODB_URI` — MongoDB connection string (required)
- `NEXTAUTH_SECRET` — NextAuth secret for JWT signing (recommended)
- `NEXTAUTH_URL` — App base URL (e.g. http://localhost:3000) (recommended)

Google OAuth 2.0 (required for "Sign in with Google"):
- `GOOGLE_CLIENT_ID` — Your Google OAuth 2.0 Client ID
- `GOOGLE_CLIENT_SECRET` — Your Google OAuth 2.0 Client Secret

Cloudinary (one of the following sets must be present for uploads to work):
- `CLOUDINARY_URL` — Optional full connection URL
OR
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional tuning vars used in `lib/mongodb.js`:
- `MONGO_SERVER_SELECTION_TIMEOUT_MS`, `MONGO_SOCKET_TIMEOUT_MS`, `MONGO_MAX_POOL_SIZE`, `MONGO_MIN_POOL_SIZE`, `MONGO_HEARTBEAT_MS`, `MONGODB_DIRECT_FALLBACK`

## Local development & testing

1) Install dependencies

```powershell
npm install
```

2) Add `.env.local` with at least the required variables above. Example minimal `.env.local` for local testing (replace placeholders):

```text
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/bitecheck
NEXTAUTH_SECRET=some-long-secret
NEXTAUTH_URL=http://localhost:3000
# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
# Cloudinary example (pick either CLOUDINARY_URL or the explicit keys)
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

### How to get Google OAuth 2.0 credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen if prompted
6. Choose "Web application" as the application type
7. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
8. Copy the Client ID and Client Secret to your `.env.local` file

3) Run dev server

```powershell
npm run dev
```

4) Test upload endpoint (optional quick check)

Use a client or curl to POST a small data URL to `/api/review-upload`. The app includes a debug GET on that endpoint that returns whether Cloudinary credentials are visible to the running process.

Example (browser / fetch) for manual test:

```js
const dataUrl = 'data:image/png;base64,iVBORw0K...';
const res = await fetch('/api/review-upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ file: dataUrl }) });
const json = await res.json();
console.log(json);
```

5) Add a review with images via the UI (Explore → Restaurant → Add Review) — images will be uploaded to Cloudinary then stored on the review document.

## Notes & next steps

- The code includes defensive indexing and connection tuning in `lib/mongodb.js` for more stable connections in constrained environments.
- The `reviews` API attempts to clean up Cloudinary resources when deleting reviews. However, Cloudinary deletion relies on parsing `public_id` from stored URLs — edge cases may need improving.
- Consider adding server-side validation for max images per review and rate-limiting for the upload endpoint.
- If you want, I can:
  - Add an OpenAPI/Swagger summary for the API routes
  - Add unit tests for API behavior (happy path + auth checks)
  - Add a short troubleshooting section for common Cloudinary and MongoDB errors

---

If you want any section expanded (examples, diagrams, or an OpenAPI spec), tell me which part and I will add it.
