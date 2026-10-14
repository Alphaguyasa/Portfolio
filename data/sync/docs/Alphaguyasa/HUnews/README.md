<div align="center">

<img src="https://www.haramaya.edu.et/wp-content/uploads/2020/09/HU-Logo.png" alt="Haramaya University" width="100" />

# HU News

**A Flutter mobile application delivering real-time news from Haramaya University**

<br/>

[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.x-0175C2?style=flat-square&logo=dart&logoColor=white)](https://dart.dev)
[![Android](https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android&logoColor=white)](./apk/app-release.apk)
[![API](https://img.shields.io/badge/API-WordPress%20REST-21759B?style=flat-square&logo=wordpress&logoColor=white)](https://www.haramaya.edu.et/wp-json/wp/v2/posts)
[![License](https://img.shields.io/badge/License-Academic-F59E0B?style=flat-square)](#-license)

<br/>

[📥 Download APK](./apk/app-release.apk) &nbsp;&nbsp;·&nbsp;&nbsp; [🎥 Live Demo](#-demo-video) &nbsp;&nbsp;·&nbsp;&nbsp; [🌐 News Source](https://www.haramaya.edu.et/category/news/)

</div>

<br/>

---

## Overview

**HU News** is a production-ready Flutter application that aggregates and presents the latest news from [Haramaya University](https://www.haramaya.edu.et) using the WordPress REST API. Built with clean architecture principles, the app delivers a smooth, native-feeling experience with features including a featured news carousel, full article rendering, reactions, smart search, YouTube video playback, and persistent dark mode.

The project demonstrates end-to-end mobile development skills — from API integration and JSON parsing to state management, data persistence, device feature access, and runtime permission handling.

---

## Features

<table>
  <thead>
    <tr>
      <th align="center">Category</th>
      <th align="left">Feature</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" rowspan="3"><b>Content</b></td>
      <td>📡 Live News Feed</td>
      <td>Real-time articles fetched from Haramaya University's WordPress REST API</td>
    </tr>
    <tr>
      <td>🎠 Featured Carousel</td>
      <td>Horizontal scrollable cards highlighting the 5 most recent posts</td>
    </tr>
    <tr>
      <td>📄 Full Article View</td>
      <td>Complete article with featured image, publish date, and rendered HTML content</td>
    </tr>
    <tr>
      <td align="center" rowspan="3"><b>Interaction</b></td>
      <td>👍 Reaction System</td>
      <td>Like, Dislike, Heart, and Fire reactions with live Snackbar feedback</td>
    </tr>
    <tr>
      <td>🔍 Smart Search</td>
      <td>Real-time filtering with bold keyword highlighting across titles and excerpts</td>
    </tr>
    <tr>
      <td>🔗 Native Share</td>
      <td>Share any article via the device's native share sheet</td>
    </tr>
    <tr>
      <td align="center" rowspan="3"><b>Media</b></td>
      <td>🎬 YouTube Player</td>
      <td>Embedded YouTube video playback for video-based posts</td>
    </tr>
    <tr>
      <td>🖼️ Smart Images</td>
      <td>Cached network images with three-tier fallback extraction strategy</td>
    </tr>
    <tr>
      <td>📋 Paginated Feed</td>
      <td>Infinite scroll with a Load More button and per-page API fetching</td>
    </tr>
    <tr>
      <td align="center" rowspan="3"><b>UX</b></td>
      <td>🌙 Dark Mode</td>
      <td>Toggle between dark and light themes — persisted across app restarts</td>
    </tr>
    <tr>
      <td>🔔 Onboarding</td>
      <td>Branded welcome screen with runtime notification permission request</td>
    </tr>
    <tr>
      <td>⚠️ Error Handling</td>
      <td>Network failure Snackbar with a one-tap Retry action</td>
    </tr>
  </tbody>
</table>

---

## Screens

| Screen             |   Route   | Description                                                                     |
| :----------------- | :-------: | :------------------------------------------------------------------------------ |
| **Onboarding**     |   Entry   | HU-branded welcome screen; requests notification permission before proceeding   |
| **Home Feed**      |  `/home`  | Featured carousel (top 5) + paginated latest news list with dark mode toggle    |
| **Article Detail** | `/detail` | Full article view with image, HTML content, date, reactions, and share button   |
| **Search**         | `/search` | Real-time search with keyword-highlighted results; navigates to detail or video |
| **Video Player**   | `/video`  | Full-screen YouTube player with progress bar, speed control, and captions       |

---

## Architecture & Project Structure

```
News_App_Internship/
│
├── lib/
│   ├── main.dart                      # App entry point, MaterialApp, theme config
│   │
│   ├── models/
│   │   └── post_model.dart            # Post entity + fromJson() with 3-tier image extraction
│   │
│   ├── services/
│   │   └── api_service.dart           # WordPress REST API — category fetch + paginated posts
│   │
│   └── screens/
│       ├── onboarding_screen.dart     # StatelessWidget — welcome + permission request
│       ├── home_screen.dart           # StatefulWidget — carousel, feed, dark mode, scroll
│       ├── post_detail_screen.dart    # StatefulWidget — article, reactions, share
│       ├── search_screen.dart         # StatefulWidget — real-time filter + highlight
│       └── video_screen.dart          # StatefulWidget — YouTube player
│
├── android/
│   ├── app/
│   │   ├── build.gradle.kts           # Release signing config
│   │   └── src/main/
│   │       ├── AndroidManifest.xml    # Permissions + network security config
│   │       └── res/xml/
│   │           └── network_security_config.xml
│   └── gradle/wrapper/
│       └── gradle-wrapper.properties  # Gradle 8.14
│
├── apk/
│   └── app-release.apk                # Signed production build
│
└── pubspec.yaml                       # Dependencies and project metadata
```

**Pattern:** The project follows a simple but effective **layered architecture** — `screens` handle UI and state, `services` handle data fetching, and `models` handle data transformation. This separation keeps each layer independently readable and maintainable.

---

## Tech Stack

### Core

| Technology         | Version | Purpose                     |
| :----------------- | :-----: | :-------------------------- |
| Flutter            |   3.x   | Cross-platform UI framework |
| Dart               |   3.x   | Programming language        |
| WordPress REST API |   v2    | Live news data source       |

### Dependencies

| Package                    | Version | Purpose                                 |
| :------------------------- | :-----: | :-------------------------------------- |
| `http`                     | ^1.5.0  | HTTP requests to the WordPress API      |
| `shared_preferences`       | ^2.3.2  | Persistent dark mode preference storage |
| `cached_network_image`     | ^3.4.1  | Network image loading with disk caching |
| `flutter_widget_from_html` | ^0.17.1 | Renders WordPress HTML article content  |
| `share_plus`               | ^10.0.0 | Native OS share sheet integration       |
| `permission_handler`       | ^11.3.1 | Runtime Android permission management   |
| `youtube_player_flutter`   | ^9.1.3  | Embedded YouTube video playback         |
| `url_launcher`             | ^6.3.0  | Opens external links in the browser     |
| `flutter_inappwebview`     | ^6.1.5  | In-app web view support                 |

---

## API Integration

**Base URL**

```
https://www.haramaya.edu.et/wp-json/wp/v2/posts
```

**Paginated News Request**

```
GET /posts?page={n}&per_page=10&categories={news_id}&_embed=true
```

**Category Discovery**

```
GET /categories?slug=news  →  resolves category ID dynamically
```

**Image Extraction Strategy**

The app uses a three-tier fallback to guarantee an image is always shown:

| Priority | Source                             | Field                                         |
| :------: | :--------------------------------- | :-------------------------------------------- |
|   1st    | WordPress embedded featured media  | `_embedded['wp:featuredmedia'][0].source_url` |
|   2nd    | Yoast SEO open graph meta tag      | `yoast_head` → `<meta property="og:image">`   |
|   3rd    | First inline image in article body | First `<img src="...">` in `content.rendered` |

---

## Requirements Coverage

<details>
<summary><b>UI &amp; Interaction</b></summary>
<br>

| Requirement       | Status | Where                                                           |
| :---------------- | :----: | :-------------------------------------------------------------- |
| Stateless widget  |   ✅   | `OnboardingScreen` — `StatelessWidget`                          |
| Stateful widget   |   ✅   | `HomeScreen`, `PostDetailScreen`, `SearchScreen`, `VideoScreen` |
| Row               |   ✅   | AppBar title, date display, reaction buttons                    |
| Column            |   ✅   | Primary layout on all screens                                   |
| Stack             |   ✅   | Home body — FAB overlaid on scroll content                      |
| Responsive design |   ✅   | `MediaQuery` in onboarding; flexible sizing throughout          |
| Input field       |   ✅   | `TextField` with search icon in `SearchScreen`                  |
| Snackbar feedback |   ✅   | Reaction confirmation + network error with Retry                |

</details>

<details>
<summary><b>Navigation &amp; State Management</b></summary>
<br>

| Requirement     | Status | Where                                                            |
| :-------------- | :----: | :--------------------------------------------------------------- |
| Push navigation |   ✅   | `Navigator.push` → Detail, Search, Video                         |
| Pop navigation  |   ✅   | System back button on all secondary screens                      |
| Data passing    |   ✅   | `Post` via constructor; `allPosts` via `RouteSettings.arguments` |
| `setState()`    |   ✅   | All Stateful screens — loading, reactions, theme, search         |

</details>

<details>
<summary><b>Data Persistence</b></summary>
<br>

| Requirement        | Status | Where                                                              |
| :----------------- | :----: | :----------------------------------------------------------------- |
| Key-value storage  |   ✅   | `SharedPreferences.setBool('isDarkMode', value)`                   |
| Data actively used |   ✅   | Read in `initState()`, applied to `MaterialApp` theme every launch |

</details>

<details>
<summary><b>Networking &amp; API Integration</b></summary>
<br>

| Requirement            | Status | Where                                                   |
| :--------------------- | :----: | :------------------------------------------------------ |
| Public API             |   ✅   | WordPress REST API — `haramaya.edu.et`                  |
| JSON parsing           |   ✅   | `Post.fromJson()` in `post_model.dart`                  |
| Fetched data displayed |   ✅   | Home, Search, and Detail screens                        |
| Loading indicator      |   ✅   | `CircularProgressIndicator` during all fetches          |
| Error handling         |   ✅   | `try/catch` → Snackbar with Retry in `home_screen.dart` |

</details>

<details>
<summary><b>Device Features &amp; Plugin Integration</b></summary>
<br>

| Requirement         | Status | Where                                                          |
| :------------------ | :----: | :------------------------------------------------------------- |
| Flutter plugin      |   ✅   | `share_plus`, `permission_handler`, `youtube_player_flutter`   |
| Device feature      |   ✅   | Native share sheet via `share_plus` on every article           |
| Permission request  |   ✅   | Notification permission on onboarding via `permission_handler` |
| Permission response |   ✅   | Graceful handling — app proceeds on both grant and denial      |
| Fully integrated    |   ✅   | Share on every article; permission on every first launch       |

</details>

---

## Getting Started

### Prerequisites

| Tool                      | Version | Download                                                      |
| :------------------------ | :-----: | :------------------------------------------------------------ |
| Flutter SDK               |  3.x+   | [flutter.dev](https://flutter.dev/docs/get-started/install)   |
| Android Studio            | Latest  | [developer.android.com](https://developer.android.com/studio) |
| Android Device / Emulator | API 21+ | Physical device or AVD                                        |

### Run Locally

```bash
# Clone the repository
git clone https://github.com/Alphaguyasa/HUnews.git
cd HUnews/News_App_Internship

# Install dependencies
flutter pub get

# Run on connected device or emulator
flutter run
```

### Build Release APK

```bash
flutter build apk --release
# → build/app/outputs/flutter-apk/app-release.apk
```

---

## Installation

| Step | Action                                                                     |
| :--: | :------------------------------------------------------------------------- |
|  1   | [Download `app-release.apk`](./apk/app-release.apk) from the `/apk` folder |
|  2   | On your phone: **Settings → Security → Install unknown apps → Enable**     |
|  3   | Open the APK file and tap **Install**                                      |
|  4   | Launch **HU News** from your app drawer                                    |

> **Note:** An active internet connection is required to load articles and images.

---

## Demo Video

<div align="center">

### 📹 [Watch on Loom](https://www.loom.com/share/448312eea5f94d8c94f9887fa15d6742)

`25–30 min` &nbsp;·&nbsp; `Continuous recording` &nbsp;·&nbsp; `Face visible` &nbsp;·&nbsp; `Show Touches enabled`

</div>

---

## Group Members

<div align="center">

|  #  | Name            | Student ID | Presentation Topic     |
| :-: | :-------------- | :--------: | :--------------------- |
|  1  | Alpha Guyasa    |  5756/15   | Home Screen            |
|  2  | Abdi Fekeda     |  0016/15   | Onboarding page        |
|  3  | Milkesa Eshetu  |  0743/15   | api and website        |
|  4  | Kenesa Asfaw    |  0628/15   | Search — telegram page |
|  5  | Fethiya Muhajir |  0421/15   | refresh page           |

</div>

---

## License

This project was built for academic purposes as part of the Mobile Application Development course at [Haramaya University](https://www.haramaya.edu.et), Ethiopia.

---

<div align="center">

Built with 💙 in Flutter &nbsp;·&nbsp; Haramaya University &nbsp;·&nbsp; 2025

</div>
