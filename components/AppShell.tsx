"use client";

import { useState } from "react";
import { LayoutDashboard, Package, ShieldCheck, BrainCircuit, Settings, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "motion/react";

type Module = "dashboard" | "shipments" | "compliance" | "intelligence" | "settings";

interface AppShellProps {
  children: React.ReactNode;
  activeModule: Module;
  onNavigate: (module: Module) => void;
}

export function AppShell({ children, activeModule, onNavigate }: AppShellProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "shipments", label: "Shipments", icon: Package },
    { id: "compliance", label: "Compliance Hub", icon: ShieldCheck },
    { id: "intelligence", label: "Intelligence", icon: BrainCircuit },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-card/50 md:flex md:w-64 md:flex-col lg:w-72">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground lowercase">normix AI</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all w-full text-left relative group",
                  activeModule === item.id
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {activeModule === item.id && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-2/3 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5", activeModule === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="sticky top-0 z-40 flex h-14 items-center border-b bg-background/80 backdrop-blur-md px-4 md:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" className="shrink-0 md:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <div className="flex h-14 items-center border-b px-6">
              <div className="flex items-center gap-2 font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight lowercase">normix AI</span>
              </div>
            </div>
            <nav className="grid gap-2 text-base font-medium p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 transition-all w-full text-left",
                    activeModule === item.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto font-bold text-lg lowercase">normix AI</div>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-x-hidden bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 p-4 md:p-6 lg:p-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-card/80 backdrop-blur-md px-2 pb-safe md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 px-3 py-1 transition-colors relative",
              activeModule === item.id
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {activeModule === item.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
