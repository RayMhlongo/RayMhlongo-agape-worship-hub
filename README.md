# Agape Worship Hub

Modern worship team management for church bands and worship departments. The app includes a premium responsive dashboard, song library, setlists, scheduling engine, member management, availability, PDF Studio, AI assistant, backup/settings areas, PWA metadata, and Firebase-ready services.

The visual system is inspired by `codebucks27/Next.js-Developer-Portfolio-Starter-Code`: bold Montserrat typography, high-contrast black/cream surfaces, generous spacing, subtle motion, and restrained accent color. No images or portfolio content were copied.

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Firebase Auth, Firestore, Storage, Hosting support
- React PDF renderer
- Gemini API-ready assistant with local fallback
- PWA manifest and app icons using the supplied Agape logo
- Capacitor Android APK packaging

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication providers:
   - Google
   - Email and password
3. Create Firestore Database.
4. Enable Firebase Storage.
5. Copy `.env.example` to `.env.local` and fill in the Firebase web app config.
6. Optional: add `GEMINI_API_KEY` or `GROQ_API_KEY` for AI provider integration.

## Environment Variables

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
GEMINI_API_KEY=
GROQ_API_KEY=
```

## Firebase Deploy

```bash
npm install -g firebase-tools
firebase login
firebase init hosting firestore storage
npm run build
firebase deploy
```

The included `firebase.json`, `firestore.rules`, and `storage.rules` provide a deploy-ready starting point.

## Android APK Support

The app is configured with Capacitor so it can run as a web app, PWA, and Android APK.

Useful commands:

```bash
npm run build:mobile
npm run android:sync
npm run android:open
npm run android:apk:debug
```

Android package name:

```text
za.org.agape.worshiphub
```

Debug APK output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Signed APK builds should be generated through Android Studio with a release keystore. Full Android instructions are in [`docs/ANDROID.md`](docs/ANDROID.md).

## GitHub Deployment

Push this repository to GitHub, then connect it to Firebase Hosting, Vercel, or another Next.js host. For Firebase App Hosting, keep `firebase.json` at the root.

## App Areas

- Dashboard: upcoming service, practice, roster, stats, countdown, recent schedules, and quick generation.
- Songs: searchable database with filtering, favorites, chord transpose, printable sheet flow, and mobile reading layout.
- Setlists: drag-and-drop song ordering, templates, duplication-ready structure, notes, leaders, dates.
- Schedule: balanced auto-assignment from availability, skill, instrument requirements, and fairness.
- Members: roles, instruments, vocalist type, skill level, preferred keys, and attendance history.
- Availability: available/unavailable dates plus recurring availability.
- PDF Studio: branded PDF generation with logo, layout controls, orientation, preview, and download.
- AI Assistant: answers worship planning questions from app data and can use Gemini when configured.
- Backup and Settings: Firebase sync blueprint and customization surfaces.
