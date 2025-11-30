import {
  ConfigPlugin,
  withAppBuildGradle,
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

/**
 * Expo config plugin to add Android Glance widget support
 */
const withAndroidWidget: ConfigPlugin = (config) => {
  // Step 1: Add Gradle dependencies
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes("androidx.glance:glance-appwidget")) {
      return config;
    }

    const dependencies = `
    // Glance Widget dependencies
    implementation "androidx.glance:glance-appwidget:1.1.0"
    implementation "androidx.datastore:datastore-preferences:1.1.1"
    implementation "androidx.work:work-runtime-ktx:2.9.1"`;

    config.modResults.contents = config.modResults.contents.replace(
      /dependencies\s*{/,
      `dependencies {${dependencies}`
    );

    return config;
  });

  // Step 2: Copy Kotlin and XML files
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidRoot = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main"
      );

      // Define source and destination paths
      const templatesDir = path.join(projectRoot, "templates");
      const kotlinPackagePath = path.join(
        androidRoot,
        "java",
        "com",
        "emplica",
        "nightly",
        "android",
        "widget"
      );
      const xmlDir = path.join(androidRoot, "res", "xml");
      const layoutDir = path.join(androidRoot, "res", "layout");

      // Create directories
      fs.mkdirSync(kotlinPackagePath, { recursive: true });
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.mkdirSync(layoutDir, { recursive: true });

      // Copy Kotlin files
      const kotlinFiles = [
        "NightlyGlanceWidget.kt",
        "NightlyGlanceWidgetReceiver.kt",
        "WidgetPreferences.kt",
        "WidgetModule.kt",
        "WidgetPackage.kt",
      ];

      for (const file of kotlinFiles) {
        const src = path.join(templatesDir, "kotlin", file);
        const dest = path.join(kotlinPackagePath, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      }

      // Copy XML files
      const xmlSrc = path.join(templatesDir, "xml", "nightly_widget_info.xml");
      const xmlDest = path.join(xmlDir, "nightly_widget_info.xml");
      if (fs.existsSync(xmlSrc)) {
        fs.copyFileSync(xmlSrc, xmlDest);
      }

      const layoutSrc = path.join(
        templatesDir,
        "layout",
        "appwidget_placeholder.xml"
      );
      const layoutDest = path.join(layoutDir, "appwidget_placeholder.xml");
      if (fs.existsSync(layoutSrc)) {
        fs.copyFileSync(layoutSrc, layoutDest);
      }

      return config;
    },
  ]);

  // Step 3: Add widget receiver to AndroidManifest
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    // Check if receiver already exists
    const receivers = mainApplication.receiver || [];
    const receiverExists = receivers.some(
      (r) =>
        r.$?.["android:name"] ===
        "com.emplica.nightly.android.widget.NightlyGlanceWidgetReceiver"
    );

    if (!receiverExists) {
      if (!mainApplication.receiver) {
        mainApplication.receiver = [];
      }

      mainApplication.receiver.push({
        $: {
          "android:name":
            "com.emplica.nightly.android.widget.NightlyGlanceWidgetReceiver",
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              {
                $: {
                  "android:name": "android.appwidget.action.APPWIDGET_UPDATE",
                },
              },
            ],
          },
        ],
        "meta-data": [
          {
            $: {
              "android:name": "android.appwidget.provider",
              "android:resource": "@xml/nightly_widget_info",
            },
          },
        ],
      } as any);
    }

    return config;
  });

  // Step 4: Register WidgetPackage in MainApplication
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const mainAppPath = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "java",
        "com",
        "emplica",
        "nightly",
        "android",
        "MainApplication.kt"
      );

      // Also try .java extension
      const mainAppPathJava = mainAppPath.replace(".kt", ".java");
      const actualPath = fs.existsSync(mainAppPath)
        ? mainAppPath
        : mainAppPathJava;

      if (fs.existsSync(actualPath)) {
        let content = fs.readFileSync(actualPath, "utf-8");

        // Add import if not present
        if (!content.includes("com.emplica.nightly.android.widget.WidgetPackage")) {
          const importStatement =
            "import com.emplica.nightly.android.widget.WidgetPackage\n";

          // Find the last import statement
          const importRegex = /import\s+[\w.]+\s*\n/g;
          const matches = [...content.matchAll(importRegex)];
          if (matches.length > 0) {
            const lastMatch = matches[matches.length - 1];
            const insertPos = lastMatch.index! + lastMatch[0].length;
            content =
              content.slice(0, insertPos) +
              importStatement +
              content.slice(insertPos);
          }
        }

        // Add WidgetPackage to packages list if not present
        if (!content.includes("WidgetPackage()")) {
          // Look for the packages list in getPackages() or similar
          const packagesRegex = /(packages\.add\([^)]+\))/g;
          const match = content.match(packagesRegex);

          if (match) {
            // Add after the last packages.add() call
            const lastAdd = match[match.length - 1];
            content = content.replace(
              lastAdd,
              `${lastAdd}\n        packages.add(WidgetPackage())`
            );
          } else {
            // Try to find return packages or similar
            content = content.replace(
              /(return\s+packages)/,
              `packages.add(WidgetPackage())\n        $1`
            );
          }
        }

        fs.writeFileSync(actualPath, content, "utf-8");
      }

      return config;
    },
  ]);

  return config;
};

export default withAndroidWidget;
