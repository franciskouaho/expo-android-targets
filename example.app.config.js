/**
 * Example Expo configuration with expo-android-targets plugin
 *
 * Copy this to your project as app.config.js and customize as needed
 */

module.exports = {
  name: "My App",           // ← Changez avec le nom de votre app
  slug: "my-app",           // ← Changez avec votre slug
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.company.myapp"  // ← Votre bundle ID iOS
  },
  android: {
    // REQUIRED: Votre package Android
    package: "com.company.myapp",  // ← IMPORTANT: Changez ceci !
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    // Add the widget plugin
    "expo-android-targets"
  ]
};
