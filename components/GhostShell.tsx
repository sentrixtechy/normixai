"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

export function GhostShell() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background md:flex-row animate-in fade-in duration-500">
      {/* Skeleton Sidebar */}
      <aside className="hidden border-r bg-slate-50 md:flex md:w-64 md:flex-col lg:w-72">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-8">
          <nav className="grid items-start px-4 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-2xl" />
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex flex-1 flex-col p-6 md:p-10 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-14 w-44 rounded-2xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-8 md:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] rounded-3xl" />
          <Skeleton className="col-span-3 h-[400px] rounded-3xl" />
        </div>
      </main>
    </div>
  );
}
