# CineMatch — AI Movie Recommender

CineMatch is a production-ready movie recommendation platform built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. It provides personalized movie suggestions by analyzing your favorite genres, current mood, and rating preferences using the **TMDB API**.

![CineMatch Preview Screenshot](https://raw.githubusercontent.com/rsk807/Movie_recommendation/main/public/screenshot.png)

## ✨ Features

- **Personalized Recommendations**: Advanced filtering based on multi-select genres, language, release year, and minimum rating.
- **Mood-Based Matching**: Select your current mood (Happy, Sad, Excited, Relaxed, Thrilled) to automatically prioritize relevant genres.
- **Real-time Search**: Debounced search bar with autocomplete suggestions and poster previews.
- **Client-side User Profile**: Maintain a persistent history of "Liked Movies", "Watchlist", and "Hidden Movies" using `localStorage`.
- **Advanced Dashboard**: Visual summary of recommendation stats, average ratings, and top genre distribution.
- **Modern UI/UX**: Premium streaming-platform aesthetic with dark theme by default, smooth Framer Motion animations, and responsive design.
- **Data Export**: Export your curated watchlist as a CSV file for external use.
- **Graceful Fallback**: Fully functional even without an API key using a high-quality local dataset.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes (Route Handlers).
- **API**: The Movie Database (TMDB) API.
- **State Management**: React Hooks + LocalStorage Persistence.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed.
- A TMDB API Key (Optional but recommended).

### 2. Installation
```bash
# Clone or move into the project directory
cd mov

# Install dependencies
npm install
```

### 3. Environment Configuration
I've already created a `.env.local` file for you with your provided TMDB API Key:
```env
TMDB_API_KEY=your_v3_api_key_here
```
*The app requires a TMDB API Key to fetch live data.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add `TMDB_API_KEY` to the **Environment Variables** in the Vercel dashboard.
4. Deploy!

## 🚧 Future Improvements

- [ ] User authentication with Clerk or NextAuth.
- [ ] Integration with streaming provider availability (JustWatch API).
- [ ] Social sharing functionality for recommendations.
- [ ] Trailer playback support within the app.

---
*This product uses the TMDB API but is not endorsed or certified by TMDB.*
