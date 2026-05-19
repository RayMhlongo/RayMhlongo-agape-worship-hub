"use client";

import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { Preferences } from "@capacitor/preferences";
import { PushNotifications, type Token } from "@capacitor/push-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import type { Member, ServiceSchedule, Setlist, Song } from "@/types/domain";

const CACHE_KEY = "agape-offline-cache-v1";

export type OfflineCachePayload = {
  songs: Song[];
  schedules: ServiceSchedule[];
  setlists: Setlist[];
  members: Member[];
  cachedAt: string;
};

export function isNativeAndroid() {
  return Capacitor.getPlatform() === "android";
}

export async function configureNativeShell(darkMode: boolean) {
  if (!Capacitor.isNativePlatform()) return;
  await SplashScreen.hide().catch(() => undefined);
  await StatusBar.setOverlaysWebView({ overlay: false }).catch(() => undefined);
  await StatusBar.setStyle({ style: darkMode ? Style.Dark : Style.Light }).catch(() => undefined);
  await StatusBar.setBackgroundColor({ color: darkMode ? "#080808" : "#f8f7f3" }).catch(() => undefined);
  await Keyboard.setAccessoryBarVisible({ isVisible: false }).catch(() => undefined);
  await Keyboard.setScroll({ isDisabled: false }).catch(() => undefined);
}

export async function cacheOfflineData(payload: Omit<OfflineCachePayload, "cachedAt">) {
  const value = JSON.stringify({ ...payload, cachedAt: new Date().toISOString() });
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key: CACHE_KEY, value });
    return;
  }
  window.localStorage.setItem(CACHE_KEY, value);
}

export async function readOfflineData() {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key: CACHE_KEY });
    return value ? (JSON.parse(value) as OfflineCachePayload) : null;
  }
  const value = window.localStorage.getItem(CACHE_KEY);
  return value ? (JSON.parse(value) as OfflineCachePayload) : null;
}

export async function registerPushNotifications(onToken?: (token: string) => void) {
  if (!Capacitor.isNativePlatform()) return null;

  let permission = await PushNotifications.checkPermissions();
  if (permission.receive !== "granted") {
    permission = await PushNotifications.requestPermissions();
  }
  if (permission.receive !== "granted") return null;

  await PushNotifications.register();
  await PushNotifications.addListener("registration", (token: Token) => {
    onToken?.(token.value);
  });
  await PushNotifications.addListener("pushNotificationReceived", () => undefined);
  await PushNotifications.addListener("pushNotificationActionPerformed", () => undefined);
  return true;
}
