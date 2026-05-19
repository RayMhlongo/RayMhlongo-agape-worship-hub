import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardStyle } from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "za.org.agape.worshiphub",
  appName: "Agape Worship Hub",
  webDir: "out",
  backgroundColor: "#f8f7f3",
  server: {
    androidScheme: "https"
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1400,
      launchAutoHide: true,
      backgroundColor: "#f8f7f3",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#f8f7f3",
      overlaysWebView: false
    },
    Keyboard: {
      style: KeyboardStyle.Light,
      resizeOnFullScreen: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
