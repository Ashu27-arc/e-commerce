# E-Commerce App

A modern, responsive e-commerce mobile application built with React Native and Expo. 
It features a full shopping flow including product listing, filtering, wishlist management, and a shopping bag/cart system.

## 🚀 Features

- **Product Listing:** Browse through a variety of products.
- **Search & Filter:** Easily find products using text search, category filters, and sorting (by price/rating).
- **Wishlist:** Save favorite items for later.
- **Shopping Bag:** Add items to cart, adjust quantities, and see total price.
- **Redux State Management:** Efficiently manages cart and wishlist states across the app.

## 🛠️ Tech Stack

- **React Native** (Expo)
- **Expo Router** (File-based routing)
- **Redux Toolkit** (State management)
- **Lucide React Native** (Icons)
- **TypeScript**

## 💻 Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/) (LTS recommended)
- npm or yarn

### 1. Install dependencies
```bash
npm install
```
*(or `yarn install` if you use Yarn)*

### 2. Start the application
```bash
npm start
```
*(or `npx expo start`)*

This will start the Metro bundler. From the terminal, you can then:
- Press **`a`** to open in **Android Emulator** (requires Android Studio setup).
- Press **`i`** to open in **iOS Simulator** (requires Xcode & macOS).
- Scan the **QR code** using the **Expo Go** app on your physical iOS or Android device.

## 📁 Project Structure

- `src/app/` - Expo Router file-based navigation entries.
- `src/screens/` - Main screens (Products, Bag, Wishlist).
- `src/components/` - Reusable UI components (ProductCard, BagItem, FilterModal, etc.).
- `src/store/` - Redux slices and store configuration.
- `src/api/` - API functions and client configuration.
- `src/types/` - TypeScript interface definitions.

## 📝 Available Scripts

- `npm start` - Starts the Expo development server.
- `npm run android` - Starts the app directly in the Android Emulator.
- `npm run ios` - Starts the app directly in the iOS Simulator.
- `npm run web` - Starts the app in your web browser.
# e-commerce
