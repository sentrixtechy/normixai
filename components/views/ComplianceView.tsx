"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, History, ListFilter, Search, ArrowRight, ShieldAlert, BookOpen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/FirebaseProvider";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

import { Skeleton } from "@/components/ui/skeleton";

function ComplianceSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        <Skeleton className="h-32 w-full rounded-[2.5rem]" />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-[2rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ComplianceView() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "shipments"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShipments(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching compliance data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Extract all issues from all shipments
  const allAlerts = shipments.flatMap(shp => 
    (shp.issues || []).map((issue: any, idx: number) => ({
      id: `${shp.id}-${idx}`,
      shpId: shp.externalId,
      type: issue.type === "error" ? "Critical" : issue.type === "warning" ? "Warning" : "Audit",
      message: issue.title,
      description: issue.description,
      date: shp.createdAt?.toDate ? shp.createdAt.toDate().toLocaleDateString() : "Today"
    }))
  );

  if (loading) {
    return (
      <div className="flex flex-col space-y-10 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-3xl" />
            <Skeleton className="h-12 w-48 rounded-3xl" />
          </div>
        </div>
        <ComplianceSkeleton />
      </div>
    );
  }

  const stats = {
    risks: shipments.filter(s => s.riskScore > 50).length,
    audits: shipments.filter(s => s.status === "Under Review").length,
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col space-y-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Compliance Hub</h1>
          <p className="text-muted-foreground mt-3 text-lg font-medium opacity-80">Real-time monitoring of regulatory risks and trade integrity.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="outline" className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] flex-1 md:flex-none border-border/40 hover:bg-muted/50">
            <History className="h-4 w-4 mr-2" /> Audit Logs
          </Button>
          <Button className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-success/20 bg-success hover:bg-success/90 flex-1 md:flex-none">
            Export All Records
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-primary/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60">Status Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Risks</span>
                <span className="text-4xl font-black tracking-tighter text-foreground font-mono">{(stats.risks || 0).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between items-center border-t border-primary/10 pt-8">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pending Audits</span>
                <span className="text-4xl font-black tracking-tighter text-foreground font-mono">{(stats.audits || 0).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between items-center border-t border-primary/10 pt-8">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vetting Speed</span>
                <span className="text-4xl font-black tracking-tighter text-foreground font-mono tracking-[-0.1em]">1.2<span className="text-xl font-black ml-1 uppercase">s</span></span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm border-t-4 border-t-success rounded-[2.5rem] bg-card/50 overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-success" />
                Vetting Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p className="text-xs text-muted-foreground leading-relaxed font-semibold opacity-70">
                Synced with <span className="font-black text-foreground">Global Customs v4.0</span> protocol and <span className="font-black text-foreground">WCO 2026</span> mandates.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-success">Nodes Verified</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input placeholder="Search alerts by shipment or type..." className="pl-12 h-14 rounded-2xl bg-card border-border/40 focus:ring-1 focus:ring-primary/20 transition-all font-bold" />
            </div>
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-border/40 hover:bg-muted/50">
              <ListFilter className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid gap-6">
            <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground/60 ml-2">Real-Time Risk Stream</h3>
            {allAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-card/30 rounded-[2.5rem] border border-dashed border-border/60">
                <ShieldCheck className="h-16 w-16 text-success/20 mb-6" />
                <h3 className="text-2xl font-black tracking-tight">System Secure</h3>
                <p className="text-muted-foreground mt-2 font-medium opacity-60">No active compliance alerts detected in your corridor.</p>
              </div>
            ) : (
              allAlerts.map((alert, i) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn(
                    "border-l-8 group cursor-pointer transition-all hover:bg-muted/20 overflow-hidden rounded-[2rem] shadow-sm hover:shadow-md active:scale-[0.99]",
                    alert.type === 'Critical' ? 'border-l-destructive shadow-lg shadow-destructive/5 bg-destructive/5' : 
                    alert.type === 'Warning' ? 'border-l-warning bg-warning/5' : 'border-l-blue-500 bg-blue-500/5'
                  )}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center p-6 md:p-8 gap-8">
                        <div className="flex items-center gap-6 flex-1">
                          <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform", 
                            alert.type === 'Critical' ? 'bg-white text-destructive border border-destructive/20' : 
                            alert.type === 'Warning' ? 'bg-white text-warning border border-warning/20' : 'bg-white text-blue-500 border border-blue-500/20'
                          )}>
                            {alert.type === 'Critical' ? <ShieldAlert className="h-8 w-8" /> : 
                             alert.type === 'Warning' ? <AlertTriangle className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-4">
                              <span className="font-black text-xs uppercase tracking-widest text-muted-foreground/60">{alert.shpId}</span>
                              <Badge variant="outline" className={cn("text-[9px] uppercase font-black tracking-widest rounded-full px-3", 
                                alert.type === 'Critical' ? 'text-destructive border-destructive/20 bg-destructive/10' : 
                                alert.type === 'Warning' ? 'text-warning border-warning/20 bg-warning/10' : 'text-blue-500 border-blue-500/20 bg-blue-500/10'
                              )}>
                                {alert.type}
                              </Badge>
                            </div>
                            <span className="text-xl font-black mt-2 text-foreground tracking-tight leading-tighter">{alert.message}</span>
                            <span className="text-xs text-muted-foreground mt-1 font-bold opacity-60 leading-relaxed max-w-2xl">{alert.description}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-none pt-6 md:pt-0">
                          <span className="text-[10px] font-black text-muted-foreground/40 font-mono uppercase tracking-[0.2em]">{alert.date}</span>
                          <Button variant="ghost" size="sm" className="rounded-2xl h-11 px-8 font-black uppercase tracking-widest text-[10px] hover:bg-card hover:shadow-sm transition-all flex items-center gap-2">
                             Trace Risk <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="border-none shadow-sm overflow-hidden group cursor-pointer hover:shadow-xl transition-all h-[200px] rounded-[2.5rem] bg-card/60 relative">
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-10 transition-opacity" />
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-black tracking-tighter flex items-center justify-between">
                    Regulatory Hub
                    <BookOpen className="h-7 w-7 text-primary/40 group-hover:text-primary transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    Access latest customs gazettes, HS code changes, and legislative updates from regional trade corridors.
                  </p>
                </CardContent>
             </Card>

             <Card className="border-none shadow-sm overflow-hidden group cursor-pointer hover:shadow-xl transition-all h-[200px] rounded-[2.5rem] bg-card/60 relative">
                <div className="absolute inset-0 bg-success/40 opacity-0 group-hover:opacity-10 transition-opacity" />
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-black tracking-tighter flex items-center justify-between">
                    Evidence Vault
                    <FileText className="h-7 w-7 text-success/40 group-hover:text-success transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    Unified repository for Bill of Ladings, Certificate of Origins, and mandatory inspection reports.
                  </p>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
