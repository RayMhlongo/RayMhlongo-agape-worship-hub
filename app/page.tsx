"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  AiAssistantPanel,
  AvailabilityPanel,
  BackupSettingsPanel,
  DashboardPanel,
  MembersPanel,
  PdfStudioPanel,
  SchedulePanel,
  SetlistsPanel,
  SongsPanel
} from "@/components/FeaturePanels";

export default function Home() {
  const [active, setActive] = useState("dashboard");

  return (
    <AppShell active={active} onNavigate={setActive}>
      {active === "dashboard" ? <DashboardPanel onNavigate={setActive} /> : null}
      {active === "songs" ? <SongsPanel /> : null}
      {active === "setlists" ? <SetlistsPanel /> : null}
      {active === "schedule" ? <SchedulePanel /> : null}
      {active === "members" ? <MembersPanel /> : null}
      {active === "availability" ? <AvailabilityPanel /> : null}
      {active === "pdf" ? <PdfStudioPanel /> : null}
      {active === "ai" ? <AiAssistantPanel /> : null}
      {active === "backup" ? <BackupSettingsPanel mode="backup" /> : null}
      {active === "settings" ? <BackupSettingsPanel mode="settings" /> : null}
    </AppShell>
  );
}
