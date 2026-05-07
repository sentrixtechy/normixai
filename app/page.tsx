"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import DashboardView from "@/components/views/DashboardView";
import ShipmentsView from "@/components/views/ShipmentsView";
import ComplianceView from "@/components/views/ComplianceView";
import IntelligenceView from "@/components/views/IntelligenceView";
import SettingsView from "@/components/views/SettingsView";
import BillingView from "@/components/views/BillingView";
import LoginView from "@/components/views/LoginView";
import { useAuth } from "@/components/FirebaseProvider";
import { GhostShell } from "@/components/GhostShell";

export default function Home() {
  const { user, loading } = useAuth();
  const [activeModule, setActiveModule] = useState<"dashboard" | "shipments" | "compliance" | "intelligence" | "settings" | "billing">("dashboard");

  if (loading) {
    return <GhostShell />;
  }

  if (!user) {
    return <LoginView />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardView onNavigate={setActiveModule as any} />;
      case "shipments":
        return <ShipmentsView />;
      case "compliance":
        return <ComplianceView />;
      case "intelligence":
        return <IntelligenceView />;
      case "settings":
        return <SettingsView />;
      case "billing":
        return <BillingView />;
      default:
        return <DashboardView onNavigate={setActiveModule as any} />;
    }
  };

  return (
    <AppShell activeModule={activeModule} onNavigate={setActiveModule}>
      {renderModule()}
    </AppShell>
  );
}
