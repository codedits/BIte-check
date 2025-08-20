Project: BiteCheck — Main file context

This file summarizes the main files and responsibilities in the BiteCheck app to help new contributors and future you.

Files inspected

- `app/layout.tsx`
  - Purpose: Root layout for Next.js app (App Router). Imports fonts and global CSS, wraps pages with `Providers`, renders `Navbar`, `Footer`, `BottomNav`, and `DataStatus`.
  - Key exports: default RootLayout, `metadata`.
  - Notes: Client components (Providers) are used to provide auth and other context to the UI.

- `app/page.tsx`
  - Purpose: Home page. Renders a hero (featured restaurant), restaurant grid, and auth CTAs.
  - Important behavior: Consumes `useRestaurants` and `useAuth` hooks. Uses `motion` (framer-motion) and `react-icons` for UI.
  - Data: expects `restaurants` array with objects containing `_id, name, rating, location, cuisine, description, priceRange`.

- `components/Navbar.tsx`
  - Purpose: Top navigation bar (desktop + mobile button). Uses `next/navigation` `usePathname` to mark active links.
  - Exports: default Navbar component.

// Removed legacy `RestaurantCard.tsx` (replaced by `SimpleRestaurantCard`).

- `lib/mongodb.js`
  - Purpose: Singleton MongoDB connection helper using mongoose.
  - Behavior: Caches connection on `global.mongoose` to avoid reconnects in serverless envs. Reads `process.env.MONGODB_URI`.
  - Errors logged to console; throws if missing URI.

- `contexts/AuthContext.js`
  - Purpose: React client context wrapping NextAuth `useSession`, exposing `login`, `logout`, `signup`, and `isAuthenticated` convenience boolean.
  - Notes: Uses `signIn`/`signOut` from `next-auth/react`. Depends on `/api/signup` for registration.

- `hooks/useRestaurants.ts`
  - Purpose: Client hook to fetch restaurants from `/api/restaurants`, cache state, provide `refetch`. Also subscribes to `eventBus` events to refresh.
  - Returned shape: { restaurants: Restaurant[], loading: boolean, error: string | null, refetch: () => void }

- `app/api/restaurants/route.js`
  - Purpose: API route (Next.js App Router) for GET (list restaurants) and POST (create restaurant).
  - Contracts:
    - GET: returns JSON array of restaurants (200), or { error } with 500.
    - POST (auth required): body { name, cuisine, location, priceRange, description } -> validation, prevents duplicates by (name, location), saves restaurant with addedBy session.user.id; returns 201 with created restaurant.
  - Error cases: missing fields -> 400; unauthenticated -> 401; duplicate -> 400.

- `app/api/reviews/route.js`
  - Purpose: API route for GET (list reviews, optional filter by userId), POST (create review), DELETE (delete review by id).
  - Contracts:
    - GET: optional query `userId`, returns array of reviews.
    - POST (auth required): body { restaurant, rating, comment } -> validates rating 1-5, non-empty comment, creates a Review, then recalculates & updates the related Restaurant's `rating` and `totalReviews`.
    - DELETE (auth required): query `id` for review ID, checks ownership (session.user.id vs review.userId) with mongoose ObjectId support; after deletion, recalculates restaurant rating or deletes restaurant if no reviews remain.
  - Error cases: unauthenticated -> 401, invalid input -> 400, not found -> 404, forbidden -> 403.

- `models/Restaurant.js`
  - Purpose: Mongoose model for restaurants.
  - Schema fields: name, cuisine, location, priceRange (enum: $, $$, $$$, $$$$), description, addedBy (ObjectId ref User), rating (Number), totalReviews (Number), image, timestamps.
  - Indexes: compound unique index on (name, location) to prevent duplicates; text index on name/cuisine/location/description for search.

Other important files in the project (not exhaustively read here)

- `app/api/test-session/` - likely for testing auth/session flows.
- `app/auth/` - sign-in and sign-up pages.
- `components/AddRestaurantModal.tsx` and `components/AddReviewModal.tsx` - UI for creating restaurants and reviews (wired to the API routes).
- `lib/auth.js` - NextAuth configuration (used by `getServerSession` via `authOptions`).
- `models/Review.js` and `models/User.js` - review and user schemas used by API routes.

Contracts / Data Shapes (summary)

- Restaurant (as used by UI):
  - _id: string
  - name: string
  - cuisine: string
  - location: string
  - priceRange: '$'|'$$'|'$$$'|'$$$$'
  - description?: string
  - rating: number (0-5, 1 decimal precision)
  - totalReviews: number
  - addedBy: string (user ObjectId)
  - image?: string

- Review (as used by API/UI):
  - _id: string
  - userId: string | populated user
  - username: string
  - restaurant: string (restaurant name)
  - rating: number
  - comment: string
  - createdAt / updatedAt timestamps

Edge cases & gotchas to watch for

- Auth identity format: session.user.id may be either a string or an ObjectId string; API routes try both ObjectId and string compare. Ensure `session.user.id` is consistent across sign-up/login flows.
- Duplicate prevention: restaurants are unique by (name, location) with a DB index and also API-level check — be mindful of case/whitespace trimming.
- Deleting last review deletes the Restaurant record — this is intentional but might be surprising. Consider soft-delete or keeping restaurants without reviews.
- Mongo connection: `lib/mongodb.js` logs connection messages; in serverless environments, keep the cached `global.mongoose` pattern.
- Client fetches rely on relative `/api/*` paths — these run serverless functions in production. Network failures should be surfaced in UI via `error` from hooks.

Suggested next steps (I can do any of these):

- Add this `MAIN_FILES.md` to the repo (done).
- Expand docs: add a short `CONTRIBUTING.md` or `ARCHITECTURE.md` to explain auth flow and eventBus.
- Add inline JSDoc comments to API route handlers and critical functions.
- Add a small smoke test script that runs a minimal set of unit tests against the API routes using a test database.

Status checklist

- Gather main file content: Done
- Create `MAIN_FILES.md` in project root: Done
- Provide contracts + edge cases: Done

If you'd like, I can now:

- Expand this file with more files (e.g., `lib/auth.js`, `models/Review.js`, `app/auth` pages). Tell me which files to include or say "include all models and API routes" and I'll add them.
- Add inline comments to specific files or generate `ARCHITECTURE.md` instead.

What would you like me to do next?
