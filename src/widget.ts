import { NativeModules, Platform } from 'react-native';

interface WidgetModuleType {
  updateWidgetData: (title: string, subtitle: string) => void;
}

const { WidgetModule } = NativeModules as { WidgetModule: WidgetModuleType };

/**
 * Update the Android home screen widget with new data
 * @param title - Main title to display in the widget
 * @param subtitle - Subtitle text to display below the title
 *
 * @example
 * ```ts
 * import { updateWidgetData } from './src/widget';
 *
 * updateWidgetData('Nightly', 'Prochain jeu: Action ou Vérité');
 * ```
 */
export function updateWidgetData(title: string, subtitle: string): void {
  if (Platform.OS === 'android' && WidgetModule) {
    try {
      WidgetModule.updateWidgetData(title, subtitle);
    } catch (error) {
      console.error('Failed to update widget:', error);
    }
  } else if (Platform.OS !== 'android') {
    console.warn('Widget updates are only supported on Android');
  } else {
    console.error('WidgetModule not found. Make sure you ran expo prebuild');
  }
}
