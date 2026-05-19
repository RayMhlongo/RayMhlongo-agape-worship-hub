# Android APK Build Guide

Agape Worship Hub is configured to run as:

- Web app with Next.js
- Progressive Web App
- Android app through Capacitor

## Native Stack

- Capacitor Android
- Splash Screen plugin
- Status Bar plugin
- Keyboard plugin
- Preferences plugin for offline cache
- Push Notifications plugin for FCM readiness

## Prerequisites

Install:

- Node.js
- Android Studio
- JDK 17+
- Android SDK Platform 36

Open Android Studio once and install the recommended SDK/build tools.

## Build Web Assets For Android

```bash
npm run build:mobile
```

This creates the static `out/` bundle used by Capacitor.

## Sync Android Project

```bash
npm run android:sync
```

This copies the latest web build into:

```text
android/app/src/main/assets/public
```

## Open In Android Studio

```bash
npm run android:open
```

From Android Studio you can run on an emulator/device or build signed APKs.

## Debug APK

```bash
npm run android:apk:debug
```

Expected output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Signed Release APK

1. In Android Studio, open `android/`.
2. Choose `Build > Generate Signed Bundle / APK`.
3. Select `APK`.
4. Create or choose a keystore.
5. Choose the `release` build variant.
6. Finish the wizard.

Expected release output:

```text
android/app/build/outputs/apk/release/app-release.apk
```

## Firebase Android Setup

For Firebase Authentication, Cloud Messaging, and Android-native Firebase services:

1. In Firebase Console, add an Android app.
2. Use package name:

```text
za.org.agape.worshiphub
```

3. Download `google-services.json`.
4. Place it here:

```text
android/app/google-services.json
```

This file is intentionally ignored by Git because it is environment-specific.

## Push Notification Readiness

The app includes Capacitor Push Notifications wiring. The native shell requests notification permission and stores the token in local storage under:

```text
agape-fcm-token
```

Production notification flows should send this token to Firestore or a server endpoint, then use Firebase Cloud Messaging for:

- worship reminders
- practice reminders
- schedule updates
- assignment notifications

## Offline Cache

The native app caches the current:

- songs
- schedules
- setlists
- members

using Capacitor Preferences. This supports viewing important worship data during services where internet is unstable.

## Native UX Notes

The app includes:

- Android safe-area viewport support
- mobile bottom tab navigation
- large touch targets
- keyboard handling hooks
- native splash screen
- native app icon assets
- reduced-motion safeguards
- mobile scrolling optimizations

## Direct APK Sharing

After building an APK, upload the APK to GitHub Releases or any trusted file host and share that URL. For Google Play Store distribution, use a signed release build and follow Play Console requirements.
