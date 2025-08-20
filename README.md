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
- **Smooth Animations**: Fade-in, slide-up, and hover effects
- **Modern Typography**: Clean, readable fonts with proper hierarchy
- **Responsive Layout**: Mobile-first design with bottom navigation

## 📱 Pages & Components

### Pages
- **Home**: Hero section, search, featured restaurants
- **Explore**: Advanced filtering and restaurant browsing
- **Restaurant Detail**: Full restaurant info, reviews, add review
- **Profile**: User profile and review history

### Components
- **Navbar**: Top navigation with glass effects
- **BottomNav**: Mobile-friendly bottom navigation
- **SimpleRestaurantCard**: Primary lightweight restaurant card (image, name, rating, subtitle)
- **SearchBar**: Interactive search with glass styling
- **StarRating**: Interactive star rating component
- **ReviewList**: Display restaurant reviews (with lightbox)
- **AddReviewModal / EditReviewModal**: Create & edit reviews

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitecheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```bash
   MONGODB_URI=mongodb+srv://bitecheck123:bitecheck1234@cluster0.wnvoemk.mongodb.net/bitecheck?retryWrites=true&w=majority&appName=Cluster0
   NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features

### Glass Effects
- Custom CSS utilities for glass morphism
- Backdrop blur and transparency effects
- Smooth hover animations and transitions

### Responsive Design
- Mobile-first approach
- Bottom navigation for mobile devices
- Responsive grid layouts
- Touch-friendly interactions

### Animation System
- Framer Motion integration
- Staggered animations for lists
- Smooth page transitions
- Interactive hover effects

### Search & Filtering
- Real-time search functionality
- Filter by cuisine, location, and price
- Dynamic results updating
- Clear filter options

### Backend & Authentication
- MongoDB Atlas database integration
- User registration and login with NextAuth.js
- Secure password hashing with bcrypt
- Protected API routes for review submission
- JWT-based session management
- User-specific review tracking

## 🎨 Custom CSS Classes

The app includes custom CSS utilities for consistent glass effects:

```css
.glass          /* Basic glass container */
.glass-card     /* Glass card with hover effects */
.glass-button   /* Glass button with interactions */
.glass-input    /* Glass input fields */
.glass-modal    /* Glass modal containers */
.text-gradient  /* Gradient text effect */
```

## 📱 Mobile Experience

- Sticky bottom navigation
- Touch-optimized interactions
- Responsive card layouts
- Mobile-friendly modals

## 🔮 Future Enhancements

- User authentication system
- Backend API integration
- Real-time reviews
- Restaurant photos and galleries
- Advanced filtering options
- Social features and sharing

## 🎨 Color Scheme

- **Primary**: Green tones (#22c55e)
- **Accent**: Orange tones (#f97316)
- **Dark**: Dark grays (#0f172a)
- **Glass**: White with transparency

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js, TailwindCSS, and Framer Motion

## 🧪 Performance & Indexes

MongoDB indexes configured for fast query paths:
- Restaurants: unique `{ name, location }`; compound `{ featured, rating, totalReviews }`; `{ rating, totalReviews }`; `{ createdAt }`; `{ featured, createdAt }`; partial `no_image_recent` (docs missing `image`); full‑text index on `name,cuisine,location,description`.
- Reviews: `{ userId, createdAt }`; `{ restaurant, createdAt }`; `{ createdAt }`; compound `{ restaurant, images.0, createdAt }` (accelerates image fallback lookups when populating missing restaurant images).

Indexes are created automatically on first model use (Mongoose). For fresh deployments you can trigger builds by hitting any API route. Monitor build progress in MongoDB Atlas (large collections may take time).
