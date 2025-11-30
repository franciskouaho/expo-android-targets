# expo-android-targets

[![npm version](https://img.shields.io/npm/v/expo-android-targets.svg)](https://www.npmjs.com/package/expo-android-targets)
[![CI](https://github.com/emplica/expo-android-targets/actions/workflows/ci.yml/badge.svg)](https://github.com/emplica/expo-android-targets/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/expo-android-targets.svg)](https://www.npmjs.com/package/expo-android-targets)

Expo config plugin to add Android Glance home screen widgets to your React Native app with seamless updates from JavaScript.

## Features

- ✅ **Zero Native Code** - Install via npm, configure, and build
- ✅ **Jetpack Glance** - Modern declarative widget UI (Compose for Glance)
- ✅ **Live Updates** - Update widget data directly from React Native
- ✅ **TypeScript** - Full type safety
- ✅ **Customizable** - Easy to modify colors, layout, and behavior
- ✅ **Production Ready** - Battle-tested with SharedPreferences persistence

## Installation

```bash
npm install expo-android-targets
# or
yarn add expo-android-targets
# or
bun add expo-android-targets
```

## Quick Start

### 1. Add Plugin to Config

**app.config.js:**
```javascript
module.exports = {
  name: "My App",
  slug: "my-app",
  android: {
    package: "com.company.myapp",
  },
  plugins: [
    "expo-android-targets"
  ],
};
```

**Or app.config.ts:**
```typescript
import { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: "My App",
  slug: "my-app",
  android: {
    package: "com.company.myapp",
  },
  plugins: [
    "expo-android-targets"
  ],
};

export default config;
```

### 2. Prebuild & Run

```bash
npx expo prebuild --platform android
npx expo run:android
```

### 3. Use in Your App

```typescript
import { updateWidgetData } from 'expo-android-targets';

function MyComponent() {
  const handleUpdate = () => {
    updateWidgetData('My Title', 'My subtitle text');
  };

  return (
    <Button title="Update Widget" onPress={handleUpdate} />
  );
}
```

### 4. Add Widget to Home Screen

1. Long-press on Android home screen
2. Tap "Widgets"
3. Find your app's widget
4. Drag to home screen

## Usage Examples

### Update on App Launch

```typescript
import { useEffect } from 'react';
import { updateWidgetData } from 'expo-android-targets';

export default function App() {
  useEffect(() => {
    updateWidgetData('Welcome', 'App is ready!');
  }, []);

  return <YourApp />;
}
```

### Update on State Change

```typescript
import { useState } from 'react';
import { updateWidgetData } from 'expo-android-targets';

function GameSelector() {
  const [selectedGame, setSelectedGame] = useState('');

  const selectGame = (game: string) => {
    setSelectedGame(game);
    updateWidgetData('Nightly', `Next game: ${game}`);
  };

  return (
    <View>
      <Button title="Truth or Dare" onPress={() => selectGame('Truth or Dare')} />
      <Button title="Never Have I Ever" onPress={() => selectGame('Never Have I Ever')} />
    </View>
  );
}
```

### Update from API Response

```typescript
import { updateWidgetData } from 'expo-android-targets';

async function fetchAndUpdateWidget() {
  const response = await fetch('https://api.example.com/status');
  const data = await response.json();

  updateWidgetData(data.title, data.subtitle);
}
```

## Customization

### Change Widget Colors

The plugin copies template files to your project. After running `expo prebuild`, you can customize:

**android/app/src/main/java/[your-package]/widget/NightlyGlanceWidget.kt:**

```kotlin
// Background color
.background(ColorProvider(android.graphics.Color.parseColor("#1a1a2e")))

// Title color
color = ColorProvider(android.graphics.Color.WHITE),

// Subtitle color
color = ColorProvider(android.graphics.Color.parseColor("#b0b0b0")),
```

### Change Widget Size

**android/app/src/main/res/xml/nightly_widget_info.xml:**

```xml
<appwidget-provider
    android:minWidth="180dp"
    android:minHeight="60dp"
    android:resizeMode="horizontal|vertical" />
```

### Add More Fields

1. Update `WidgetPreferences.kt` to add new SharedPreferences keys
2. Update `WidgetModule.kt` to accept new parameters
3. Update `NightlyGlanceWidget.kt` to display new fields
4. Update TypeScript types in your app

See [Advanced Customization Guide](./ADVANCED.md) for detailed examples.

## How It Works

This plugin automatically:

1. **Adds Gradle Dependencies** - Injects Jetpack Glance and AndroidX libraries
2. **Copies Kotlin Files** - Installs widget implementation, receiver, and React Native module
3. **Copies XML Resources** - Adds widget provider config and placeholder layout
4. **Updates AndroidManifest** - Registers the widget receiver with intent filters
5. **Registers Native Module** - Adds `WidgetPackage` to your `MainApplication`

## Architecture

```
┌─────────────────────┐
│   React Native      │
│   updateWidgetData()│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   WidgetModule      │
│   (Native Module)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ WidgetPreferences   │
│ (SharedPreferences) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ NightlyGlanceWidget │
│ (Glance Composable) │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│   Home Screen UI    │
└─────────────────────┘
```

## Requirements

- Expo SDK 49+
- Android minSdkVersion 21+
- React Native 0.70+

## TypeScript

Fully typed out of the box:

```typescript
import { updateWidgetData } from 'expo-android-targets';

// Type signature
updateWidgetData(title: string, subtitle: string): void
```

## Troubleshooting

### Widget Not Appearing

Run clean prebuild:
```bash
rm -rf android
npx expo prebuild --platform android --clean
npx expo run:android
```

### Widget Not Updating

Check native logs:
```bash
adb logcat | grep -i widget
```

Verify module registration:
```bash
cat android/app/src/main/java/*/MainApplication.* | grep WidgetPackage
```

### Build Errors

Ensure your Android package name matches across:
- `app.config.js` → `android.package`
- Generated Kotlin files
- AndroidManifest.xml

## Different Package Name

The plugin auto-detects your package name from `app.config.js`. If you need to customize paths, you can configure the plugin:

```javascript
plugins: [
  [
    "expo-android-targets",
    {
      androidPackage: "com.custom.package"
    }
  ]
]
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Publishing Updates

If you're maintaining this package:

```bash
# Build TypeScript
npm run build

# Test locally
npm link
cd /path/to/test-app
npm link expo-android-targets

# Publish to npm
npm version patch # or minor, major
npm publish --access public
```

## License

MIT © Emplica

## Support

- 📖 [Full Documentation](./WIDGET_SETUP.md)
- 🐛 [Report Issues](https://github.com/emplica/expo-android-targets/issues)
- 💬 [Discussions](https://github.com/emplica/expo-android-targets/discussions)

## Related

- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)
- [Jetpack Glance](https://developer.android.com/jetpack/compose/glance)
- [Android App Widgets](https://developer.android.com/guide/topics/appwidgets/overview)

---

Made with ❤️ by Emplica
