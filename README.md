# 🏍️ RideSync AI

> **AI-Powered Motorcycle Travel Companion**

RideSync AI is a premium, production-ready web application built for adventure riders to plan smarter, ride farther, capture every journey, and ensure safety in high-altitude extreme terrains.

---

## ✨ Features & Modules Completed

### 1. 🛜 Firebase Backend & Auth Context (Modules 2, 11A)
- Secure Sign In / Sign Up / Forgot Password email-based flows.
- Automated `updateProfile` username sync.
- React Auth Context wrapper managing session persistence.
- Auto-sync state preservation in localStorage.

### 2. 🗺️ Smart Route Planner (Modules 3, 4 & 5)
- Real-time geocoding and Leaflet map routing.
- Reactive calculations for distance, duration, fuel required, cost, elevation profile, and average speed based on motorcycle selection.
- Dynamic route mode configurations (Scenic, Fastest, Highway).
- GPX & JSON map coordinates export.

### 3. 🌤️ Weather Radar & Intelligence (Module 6)
- Mountain pass microclimate meteorological radar.
- Real OpenWeather API key integration in settings or fallback mock Spiti Valley conditions.

### 4. 🎒 Packing Assistant (Module 7)
- Dynamic checklists, motorcycle-based smart recommendations, progress bar, trip templates, and status persistence.

### 5. 📖 Ride Journal & Trip History (Module 8)
- Seamless integration with Route Planner (routes are saved directly into the journal database).
- Personal ride history, ratings, motorcycle metadata, photo uploads, search query filters, and persistent records.

### 6. 🚨 Emergency SOS & Safety Hub (Module 9)
- Real-time GPS location via Geolocation API.
- Satellite-sync dispatcher countdown animation.
- Emergency contacts CRUD with primary contact tagging.
- Emergency helplines (112, Himalayan Rescue, etc.) and Google Maps nearby links.
- 5-section offline mountain rescue safety guide.

### 7. ⚙️ Settings & User Preferences (Module 10)
- Full Rider Profile fields (Blood Group, Bio, Sat Connection details).
- Units selector (km/mi, °C/°F) and notification toggles.
- dynamic Map Tile Provider switcher (OpenStreetMap, CARTO voyager/dark, OpenTopoMap).
- Full local data export/import as JSON files & storage clear tool.

### 8. ☁️ Firestore Cloud Data Sync (Module 11B)
- Full Firestore database integration (`userData/{uid}`) syncing Settings, Garage, Routes, Journal, and Contacts.
- Safe load-before-sync pipeline preventing startup local-over-cloud writes.
- Sleek header cloud synchronization status badge (`Syncing`, `Synced`, `Offline`, `Sync Err`) and full glassmorphic page loading blocker screen.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Language**: TypeScript
- **Database / Auth**: Firebase Auth & Firestore DB
- **Styles**: Tailwind CSS
- **Icons**: Lucide Icons
- **Animation**: Framer Motion
- **Maps**: Leaflet JS (Day/Night CARTO matter, OpenTopoMap, OpenStreetMap)

---

## 🚀 Getting Started

### Prerequisites

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Installation

```bash
# Clone the repository
git clone https://github.com/gnanendra-07/ridesync-ai.git

# Install dependencies
npm install

# Run the local development server
npm run dev

# Build the project for production
npm run build
```

---

## 📂 Project Structure

```
src/
 ├── app/         # Next.js pages & root routing
 ├── components/  # Reusable UI & Feature components
 ├── contexts/    # React context providers (AuthContext)
 ├── lib/         # SDK config wrappers (firebase.ts)
 └── styles/      # Globals styles
```

---

## 👨‍💻 Developer

**Gnanendra Reddy**

GitHub: [gnanendra-07](https://github.com/gnanendra-07)

---

## ⭐ Status

✅ **All Modules (1-12) successfully completed and deployed.**
🏆 Production-ready, linted, fully typechecked, and built with 0 errors and 0 warnings.
