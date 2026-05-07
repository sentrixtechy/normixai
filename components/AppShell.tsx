"use client";

import { useState } from "react";
import { LayoutDashboard, Package, ShieldCheck, BrainCircuit, Settings, LogOut, Menu, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "motion/react";
import { logOut } from "@/lib/firebase";
import Image from "next/image";

type Module = "dashboard" | "shipments" | "compliance" | "intelligence" | "settings" | "billing";

interface AppShellProps {
  children: React.ReactNode;
  activeModule: Module;
  onNavigate: (module: Module) => void;
}

export function AppShell({ children, activeModule, onNavigate }: AppShellProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "shipments", label: "Shipments", icon: Package },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
    { id: "compliance", label: "Compliance Hub", icon: ShieldCheck },
    { id: "intelligence", label: "Intelligence", icon: BrainCircuit },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-slate-50/50 dark:bg-slate-900/50 md:flex md:w-64 md:flex-col lg:w-72">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl shadow-lg shadow-primary/20">
              <Image 
                src="https://res.cloudinary.com/dalu1szbz/image/upload/q_auto/f_auto/v1777665095/IMG-20260501-WA0011_wzh9zv.jpg" 
                alt="Logo" 
                fill 
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-foreground leading-none">Sentrix Cargo</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1">Logistics OS</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-8">
          <nav className="grid items-start px-4 text-sm font-bold gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition-all w-full text-left relative group",
                  activeModule === item.id
                    ? "text-primary bg-primary/5 shadow-inner"
                    : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {activeModule === item.id && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-3/5 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", activeModule === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className={cn("tracking-tight transition-all", activeModule === item.id ? "translate-x-1" : "")}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <Button 
            variant="ghost" 
            onClick={() => logOut()}
            className="w-full justify-start text-muted-foreground hover:text-destructive gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/60 backdrop-blur-xl px-6 md:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="shrink-0 md:hidden rounded-2xl" />}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-6 w-[300px] border-r-none">
            <div className="flex items-center gap-3 mb-10">
              <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl">
                <Image 
                  src="https://res.cloudinary.com/dalu1szbz/image/upload/q_auto/f_auto/v1777665095/IMG-20260501-WA0011_wzh9zv.jpg" 
                  alt="Logo" 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-2xl font-black tracking-tight">Sentrix Cargo</span>
            </div>
            <nav className="grid gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-5 py-4 transition-all w-full text-left",
                    activeModule === item.id
                      ? "bg-primary/5 text-primary font-black shadow-inner"
                      : "text-muted-foreground font-bold hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  {item.label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto flex items-center gap-2">
           <span className="text-xl font-black tracking-tighter">Sentrix</span>
           <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
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
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t bg-background/60 backdrop-blur-xl px-4 pb-safe md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center justify-center space-y-1.5 px-4 py-2 transition-all relative group",
              activeModule === item.id
                ? "text-primary"
                : "text-muted-foreground/60"
            )}
          >
            {activeModule === item.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary/10 rounded-[1.5rem] -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
              />
            )}
            <item.icon className={cn("h-6 w-6 transition-transform", activeModule === item.id ? "scale-110" : "group-hover:scale-110")} />
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
