# Quick Start - expo-android-targets

## TL;DR

```bash
# 1. Install package
bun add expo-android-targets

# 2. Add to app.config.js
# See example below

# 3. Generate native code
bunx expo prebuild --platform android

# 4. Run the app
bunx expo run:android
```

## Minimal app.config.js

```javascript
module.exports = {
  name: "My App",              // ← Votre nom d'app
  slug: "my-app",              // ← Votre slug
  android: {
    package: "com.company.myapp",  // ← IMPORTANT: Votre package Android
  },
  plugins: ["expo-android-targets"],
};
```

## Use in Your App

```typescript
import { updateWidgetData } from 'expo-android-targets';

// Update the widget
updateWidgetData('Nightly', 'Prochain jeu: Action ou Vérité');
```

## Testing

1. Build: `bunx expo run:android`
2. Long-press home screen → Widgets → Nightly
3. Drag widget to home screen
4. Open app and call `updateWidgetData()`
5. Widget updates instantly ✨

## Troubleshooting

**Widget not found?**
```bash
bunx expo prebuild --clean
bunx expo run:android
```

**Not updating?**
- Check `adb logcat | grep -i widget` for errors
- Verify MainApplication.kt includes WidgetPackage

**Different package name?**
- Update all package declarations in Kotlin files
- Update paths in `withAndroidWidget.ts`

---

📚 **Full documentation:** See `WIDGET_SETUP.md`
