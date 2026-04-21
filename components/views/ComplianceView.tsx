"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, History, ListFilter, Search, ArrowRight, ShieldAlert, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const alerts = [
  { id: "AL-802", type: "Critical", shp: "SHP-1090", message: "Sanctioned Entity Match (High confidence)", date: "2h ago" },
  { id: "AL-798", type: "Warning", shp: "SHP-1091", message: "HS Code 8471.30 mismatch with invoice text", date: "5h ago" },
  { id: "AL-792", type: "Audit", shp: "SHP-1085", message: "Manual audit requested by KRA Agent", date: "1d ago" },
];

export default function ComplianceView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter">Compliance Hub</h1>
          <p className="text-muted-foreground mt-2 text-base">Real-time monitoring of regulatory risks and document integrity.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 font-bold flex items-center gap-2">
            <History className="h-4 w-4" /> Audit Logs
          </Button>
          <Button className="rounded-full px-6 font-bold shadow-xl shadow-primary/20 bg-success hover:bg-success/90">
            Export Compliance Docs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary/60">Overview Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Risks</span>
                <span className="text-4xl font-black tracking-tight text-foreground">03</span>
              </div>
              <div className="flex justify-between items-end border-t pt-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending Audits</span>
                <span className="text-4xl font-black tracking-tight text-foreground">12</span>
              </div>
              <div className="flex justify-between items-end border-t pt-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Vetting Speed</span>
                <span className="text-4xl font-black tracking-tight text-foreground">1.2<span className="text-lg">s</span></span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md border-t-4 border-t-success">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                System Integrity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your trade compliance nodes are synced with <span className="font-bold text-foreground">AfCFTA v3.1</span> and <span className="font-bold text-foreground">WCO 2024</span> databases.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Vetting Engine Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search alerts by shipment or type..." className="pl-11 h-12 rounded-2xl bg-card border-border/60 shadow-sm" />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl">
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4">
            <h3 className="text-xs font-black tracking-[0.3em] uppercase text-muted-foreground ml-1">Live Risk Stream</h3>
            {alerts.map((alert, i) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={cn(
                  "border-l-4 group cursor-pointer transition-all hover:bg-muted/30 overflow-hidden rounded-2xl md:rounded-3xl",
                  alert.type === 'Critical' ? 'border-l-destructive shadow-lg shadow-destructive/5' : 
                  alert.type === 'Warning' ? 'border-l-warning' : 'border-l-blue-500'
                )}>
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                      <div className="flex items-center gap-5 flex-1">
                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-inner", 
                          alert.type === 'Critical' ? 'bg-destructive/10 text-destructive' : 
                          alert.type === 'Warning' ? 'bg-warning/10 text-warning' : 'bg-blue-500/10 text-blue-500'
                        )}>
                          {alert.type === 'Critical' ? <ShieldAlert className="h-6 w-6" /> : 
                           alert.type === 'Warning' ? <AlertTriangle className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-xs uppercase tracking-widest text-muted-foreground">{alert.id}</span>
                            <Badge variant="outline" className={cn("text-[10px] uppercase font-black tracking-widest", 
                              alert.type === 'Critical' ? 'text-destructive border-destructive/20 bg-destructive/5' : 
                              alert.type === 'Warning' ? 'text-warning border-warning/20 bg-warning/5' : 'text-blue-500 border-blue-500/20 bg-blue-500/5'
                            )}>
                              {alert.type}
                            </Badge>
                          </div>
                          <span className="text-base font-bold mt-1 text-foreground leading-tight">{alert.message}</span>
                          <span className="text-xs font-bold text-muted-foreground mt-1 font-mono uppercase tracking-tighter">Context: {alert.shp}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                        <span className="text-xs font-bold text-muted-foreground/60 font-mono uppercase">{alert.date}</span>
                        <Button variant="ghost" size="sm" className="rounded-full px-6 font-bold group-hover:bg-primary/5 group-hover:text-primary transition-all">
                          Investigate <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-none shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all h-[180px]">
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-10 transition-opacity" />
                <CardHeader>
                  <CardTitle className="text-2xl font-black tracking-tighter flex items-center justify-between">
                    Regulatory Feed
                    <BookOpen className="h-6 w-6 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    View latest customs gazettes and legal changes from EAC, ECOWAS, and SADC regions.
                  </p>
                </CardContent>
             </Card>

             <Card className="border-none shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all h-[180px]">
                <div className="absolute inset-0 bg-success/40 opacity-0 group-hover:opacity-10 transition-opacity" />
                <CardHeader>
                  <CardTitle className="text-2xl font-black tracking-tighter flex items-center justify-between">
                    Doc Center
                    <FileText className="h-6 w-6 text-success" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Unified repository for bills of lading, certificates of origin, and inspection reports.
                  </p>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
