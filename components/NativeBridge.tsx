"use client";

import { useEffect } from "react";
import { cacheOfflineData, configureNativeShell, registerPushNotifications } from "@/lib/native";
import { useWorshipStore } from "@/store/useWorshipStore";

export function NativeBridge() {
  const { darkMode, songs, schedules, setlists, members } = useWorshipStore();

  useEffect(() => {
    void configureNativeShell(darkMode);
  }, [darkMode]);

  useEffect(() => {
    void cacheOfflineData({ songs, schedules, setlists, members });
  }, [songs, schedules, setlists, members]);

  useEffect(() => {
    void registerPushNotifications((token) => {
      window.localStorage.setItem("agape-fcm-token", token);
    });
  }, []);

  return null;
}
