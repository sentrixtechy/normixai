"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import DashboardView from "@/components/views/DashboardView";
import ShipmentsView from "@/components/views/ShipmentsView";
import ComplianceView from "@/components/views/ComplianceView";
import IntelligenceView from "@/components/views/IntelligenceView";
import SettingsView from "@/components/views/SettingsView";

export default function Home() {
  const [activeModule, setActiveModule] = useState<"dashboard" | "shipments" | "compliance" | "intelligence" | "settings">("dashboard");

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardView onNavigate={setActiveModule} />;
      case "shipments":
        return <ShipmentsView />;
      case "compliance":
        return <ComplianceView />;
      case "intelligence":
        return <IntelligenceView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={setActiveModule} />;
    }
  };

  return (
    <AppShell activeModule={activeModule} onNavigate={setActiveModule}>
      {renderModule()}
    </AppShell>
  );
}
