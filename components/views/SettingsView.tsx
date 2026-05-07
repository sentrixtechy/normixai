"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { User, Bell, Shield, Wallet, Globe, Database } from "lucide-react";

export default function SettingsView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10 pb-20 md:pb-0"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Node Settings</h1>
        <p className="text-muted-foreground mt-3 text-lg font-medium opacity-80">Configure your Sentrix node, permissions, and global trade corridors.</p>
      </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-card/50">
          <CardHeader className="bg-muted/10 p-8 border-b border-border/40">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Organization Profile</CardTitle>
                <CardDescription className="font-semibold">Core identity for automated customs declarations.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Exporter Legal Name</Label>
                <Input defaultValue="Sentrix Cargo Operations" className="h-12 rounded-2xl bg-background border-border/40 focus:ring-1 focus:ring-primary/20 transition-all font-bold" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">TIN / Regional Identifier</Label>
                <Input defaultValue="SNTX-GLB-2026" className="h-12 rounded-2xl bg-background border-border/40 focus:ring-1 focus:ring-primary/20 transition-all font-mono font-black" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Global Headquarters</Label>
              <Input defaultValue="100 World Trade Center, New York, NY" className="h-12 rounded-2xl bg-background border-border/40 focus:ring-1 focus:ring-primary/20 transition-all font-bold" />
            </div>
            <Button className="h-12 rounded-2xl px-10 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Apply Configuration</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">Security & Vetting</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
              <div className="space-y-1">
                <p className="font-bold">Real-time Watchlist Screening</p>
                <p className="text-xs text-muted-foreground">Sync every shipment against global sanctions lists automatically.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
              <div className="space-y-1">
                <p className="font-bold">AI Document Hardening</p>
                <p className="text-xs text-muted-foreground">Advanced OCR and verification for high-value logistics.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden border-t-4 border-t-primary bg-card/50">
          <CardHeader className="p-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Infrastructure Hub</CardTitle>
                <CardDescription className="font-semibold">Connected services and trade data nodes.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-8">
            <div className="flex items-center justify-between p-6 rounded-3xl bg-background/50 border border-border/40 group hover:border-primary/30 transition-all cursor-default">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-slate-950 flex items-center justify-center flex-shrink-0">
                  <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white animate-spin [animation-duration:3s]" />
                </div>
                <div>
                  <p className="font-black text-lg tracking-tight">Firebase Enterprise</p>
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Real-time Data Cluster</p>
                </div>
              </div>
              <Badge variant="success" className="rounded-full px-4 py-1 font-black uppercase tracking-widest text-[10px]">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-6 rounded-3xl bg-background/50 border border-border/40 group hover:border-primary/30 transition-all cursor-default">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  <Globe className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-black text-lg tracking-tight">Global Customs API</p>
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Global E-Filing Node</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-10 px-6 border-border/60 hover:bg-muted/50 transition-all">Configure</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
