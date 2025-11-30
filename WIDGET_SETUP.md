# Android Widget Setup Guide

Complete guide for installing and using the `expo-android-targets` widget plugin.

## Prerequisites

- Expo SDK project (managed or bare workflow)
- Bun or npm/yarn package manager
- Android development environment set up

## Installation Steps

### 1. Install Package

```bash
npm install expo-android-targets
# or
yarn add expo-android-targets
# or
bun add expo-android-targets
```

### 2. Configure app.config.js

Update your `app.config.js` to include the plugin:

```javascript
module.exports = {
  name: "My App",         // ← Changez avec le nom de votre app
  slug: "my-app",         // ← Changez avec votre slug
  version: "1.0.0",
  orientation: "portrait",
  android: {
    package: "com.company.myapp",  // ← IMPORTANT: Votre package Android
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  plugins: [
    "expo-android-targets"
  ],
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  }
};
```

Or if using TypeScript (`app.config.ts`):

```typescript
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'My App',       // ← Changez avec le nom de votre app
  slug: 'my-app',       // ← Changez avec votre slug
  android: {
    package: 'com.company.myapp',  // ← IMPORTANT: Votre package Android
  },
  plugins: ['expo-android-targets'],
});
```

### 3. Run Prebuild

Generate native Android project:

```bash
# Clean previous builds (recommended)
rm -rf android ios

# Run prebuild
bunx expo prebuild --platform android

# Or for both platforms
bunx expo prebuild
```

### 4. Build and Run

```bash
# Development build
bunx expo run:android

# Or production build
bunx eas build --platform android
```

## Usage in Your App

### Basic Usage

```typescript
import { updateWidgetData } from 'expo-android-targets';

// Update the widget with new data
updateWidgetData('Nightly', 'Prochain jeu: Action ou Vérité');
```

### Example Integration

```typescript
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { updateWidgetData } from 'expo-android-targets';

export default function App() {
  // Update widget when app launches
  useEffect(() => {
    updateWidgetData('Nightly', 'Bienvenue !');
  }, []);

  const handleGameSelected = (gameName: string) => {
    // Update widget when user selects a game
    updateWidgetData('Nightly', `Prochain jeu: ${gameName}`);
  };

  return (
    <View>
      <Button
        title="Action ou Vérité"
        onPress={() => handleGameSelected('Action ou Vérité')}
      />
      <Button
        title="Qui est le plus"
        onPress={() => handleGameSelected('Qui est le plus')}
      />
    </View>
  );
}
```

### TypeScript Support

The widget helper is fully typed. The function signature:

```typescript
function updateWidgetData(title: string, subtitle: string): void
```

## Widget Customization

### Modify Widget Appearance

Edit `templates/kotlin/NightlyGlanceWidget.kt` to customize:

**Colors:**
```kotlin
.background(ColorProvider(android.graphics.Color.parseColor("#1a1a2e")))  // Background
color = ColorProvider(android.graphics.Color.WHITE),  // Title color
color = ColorProvider(android.graphics.Color.parseColor("#b0b0b0")),  // Subtitle color
```

**Text Sizes:**
```kotlin
fontSize = 16.sp,  // Title size
fontSize = 14.sp,  // Subtitle size
```

**Padding:**
```kotlin
.padding(12.dp)  // Widget padding
```

### Add More Data Fields

1. **Update `WidgetPreferences.kt`:**
```kotlin
data class WidgetData(
    val title: String = "Nightly",
    val subtitle: String = "Aucune donnée",
    val extraField: String = ""  // Add new field
)

object WidgetPreferences {
    private const val KEY_EXTRA = "widget_extra"

    fun write(context: Context, title: String, subtitle: String, extra: String) {
        getPreferences(context).edit().apply {
            putString(KEY_TITLE, title)
            putString(KEY_SUBTITLE, subtitle)
            putString(KEY_EXTRA, extra)
            apply()
        }
    }

    fun read(context: Context): WidgetData {
        val prefs = getPreferences(context)
        return WidgetData(
            title = prefs.getString(KEY_TITLE, "Nightly") ?: "Nightly",
            subtitle = prefs.getString(KEY_SUBTITLE, "Aucune donnée") ?: "Aucune donnée",
            extraField = prefs.getString(KEY_EXTRA, "") ?: ""
        )
    }
}
```

2. **Update `WidgetModule.kt`:**
```kotlin
@ReactMethod
fun updateWidgetData(title: String, subtitle: String, extra: String) {
    WidgetPreferences.write(reactApplicationContext, title, subtitle, extra)
    scope.launch {
        NightlyGlanceWidget.refreshAll(reactApplicationContext)
    }
}
```

3. **Update `src/widget.ts`:**
```typescript
export function updateWidgetData(
  title: string,
  subtitle: string,
  extra?: string
): void {
  if (Platform.OS === 'android' && WidgetModule) {
    WidgetModule.updateWidgetData(title, subtitle, extra || '');
  }
}
```

### Widget Size

Modify `templates/xml/nightly_widget_info.xml`:

```xml
android:minWidth="180dp"   <!-- Minimum width -->
android:minHeight="60dp"   <!-- Minimum height -->
android:resizeMode="horizontal|vertical"  <!-- Resize options -->
```

## Troubleshooting

### Widget Not Appearing

1. **Check if the receiver is registered:**
```bash
# Inspect AndroidManifest.xml
cat android/app/src/main/AndroidManifest.xml | grep -A 10 "NightlyGlanceWidgetReceiver"
```

2. **Verify Kotlin files are copied:**
```bash
ls -la android/app/src/main/java/com/emplica/nightly/android/widget/
```

3. **Check build.gradle dependencies:**
```bash
cat android/app/build.gradle | grep glance
```

### Widget Not Updating

1. **Check logcat for errors:**
```bash
bunx expo run:android
# Then in another terminal:
adb logcat | grep -i widget
```

2. **Verify WidgetModule is registered:**
```bash
cat android/app/src/main/java/com/emplica/nightly/android/MainApplication.kt | grep WidgetPackage
```

3. **Clear app data and reinstall:**
```bash
adb uninstall com.emplica.nightly.android
bunx expo run:android
```

### Build Errors

**"Package androidx.glance not found"**
- Run `bunx expo prebuild --clean` to regenerate native code

**"Duplicate class found"**
- Clean build: `cd android && ./gradlew clean && cd ..`
- Delete `android` folder and run `bunx expo prebuild` again

**MainApplication not found**
- Check if your package name matches `com.emplica.nightly.android`
- Update paths in the plugin if using a different package

## Testing the Widget

1. **Build the app:**
```bash
bunx expo run:android
```

2. **Add widget to home screen:**
   - Long-press on Android home screen
   - Tap "Widgets"
   - Find "Nightly" widget
   - Drag to home screen

3. **Test updates:**
   - Open the app
   - Trigger `updateWidgetData()` from your code
   - Widget should update immediately

## Production Build

### Local Build

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for production
eas build --platform android --profile production
```

## Advanced Features

### Add Click Actions

Modify `NightlyGlanceWidget.kt` to add clickable actions:

```kotlin
import androidx.glance.action.clickable
import androidx.glance.action.actionStartActivity
import android.content.Intent

// In WidgetContent:
Column(
    modifier = GlanceModifier
        .fillMaxSize()
        .clickable(
            onClick = actionStartActivity(
                Intent(context, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
            )
        )
) {
    // ... existing content
}
```

### Periodic Updates

While Glance doesn't support `updatePeriodMillis` reliably, you can use WorkManager:

```kotlin
// In WidgetModule.kt
import androidx.work.*
import java.util.concurrent.TimeUnit

fun schedulePeriodicUpdate() {
    val updateRequest = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(
        15, TimeUnit.MINUTES
    ).build()

    WorkManager.getInstance(reactApplicationContext)
        .enqueueUniquePeriodicWork(
            "widget_update",
            ExistingPeriodicWorkPolicy.KEEP,
            updateRequest
        )
}
```

## Package Name Customization

If your package is **not** `com.emplica.nightly.android`, update these files:

1. **All Kotlin files** - Change package declaration:
```kotlin
package com.yourcompany.yourapp.widget
```

2. **Plugin** (`plugins/withAndroidWidget.ts`):
```typescript
const kotlinPackagePath = path.join(
  androidRoot,
  "java",
  "com",
  "yourcompany",
  "yourapp",
  "widget"
);
```

3. **AndroidManifest receiver name**:
```typescript
"android:name": "com.yourcompany.yourapp.widget.NightlyGlanceWidgetReceiver"
```

4. **MainApplication path** in plugin:
```typescript
const mainAppPath = path.join(
  config.modRequest.platformProjectRoot,
  "app",
  "src",
  "main",
  "java",
  "com",
  "yourcompany",
  "yourapp",
  "MainApplication.kt"
);
```

## Resources

- [Jetpack Glance Documentation](https://developer.android.com/jetpack/compose/glance)
- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)
- [Android App Widgets Overview](https://developer.android.com/guide/topics/appwidgets/overview)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Android logs: `adb logcat`
3. Verify all files are created in correct locations
4. Ensure package names match throughout all files
