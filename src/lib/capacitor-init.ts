import { isNativePlatform, isAndroid } from './utils/platform';

export async function initializeCapacitor() {
  if (!isNativePlatform()) return;

  const { StatusBar, Style } = await import('@capacitor/status-bar');

  if (isAndroid()) {
    // Non-overlay mode: system handles the status bar space
    // No need for safe-area padding — status bar doesn't overlap content
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
    await StatusBar.setStyle({ style: Style.Dark }); // dark icons on white bg
    // Set CSS variable to 0 so all var(--safe-area-top) resolve to 0
    document.documentElement.style.setProperty('--safe-area-top', '0px');
  } else {
    // iOS: env(safe-area-inset-top) works natively
    await StatusBar.setStyle({ style: Style.Dark });
  }

  // Back button handling
  const { App } = await import('@capacitor/app');
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
}
