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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-4xl font-extrabold tracking-tighter">System Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your Normix node, team permissions, and API integrations.</p>
      </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">Profile Configuration</CardTitle>
            </div>
            <CardDescription>Public identity for bill of lading and customs declarations.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Exporter Name</Label>
                <Input defaultValue="Normix Trade Ltd" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">TIN / VAT Number</Label>
                <Input defaultValue="NG-90210-XT" className="h-11 rounded-xl font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Office Address</Label>
              <Input defaultValue="12 Lekki Phase 1, Lagos, Nigeria" className="h-11 rounded-xl" />
            </div>
            <Button className="rounded-xl px-8 font-bold">Save Changes</Button>
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

        <Card className="border-none shadow-md overflow-hidden border-t-4 border-t-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">API & Integrations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                  <span className="text-white font-black text-xs">SB</span>
                </div>
                <div>
                  <p className="font-bold">Supabase Cloud</p>
                  <p className="text-xs text-muted-foreground">Database & Auth connected</p>
                </div>
              </div>
              <Badge variant="success" className="rounded-full px-3">Active</Badge>
            </div>
            <div className="flex items-center justify-between border-t pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">Customs API (E-Filing)</p>
                  <p className="text-xs text-muted-foreground">Direct connection to KRA/FIRS</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold">Configure</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
