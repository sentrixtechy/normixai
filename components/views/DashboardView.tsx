"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShieldAlert, ArrowRight, FileText, CheckCircle2, TrendingUp, Zap, Loader2, BarChart3, Globe2, Activity, Package, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/FirebaseProvider";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <Skeleton className="h-14 w-44 rounded-2xl" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
      <div className="grid gap-8 md:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] rounded-3xl" />
        <Skeleton className="col-span-3 h-[400px] rounded-3xl" />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardView({ onNavigate }: { onNavigate: (module: any) => void }) {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "shipments"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        let derivedStatus = data.status;
        const score = data.riskScore || 0;
        if (score > 80) derivedStatus = "High Risk";
        else if (score >= 50) derivedStatus = "Under Review";
        else derivedStatus = "Cleared";
        
        return {
          id: doc.id,
          ...data,
          status: derivedStatus
        };
      });

      docs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setShipments(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const stats = {
    active: shipments.length,
    savings: shipments.reduce((acc, curr) => acc + (curr.riskScore < 20 ? curr.totalValue * 0.05 : 0), 0),
    risks: shipments.filter(s => s.riskScore >= 50).length,
    health: shipments.length > 0 
      ? Math.round(shipments.reduce((acc, curr) => acc + (100 - curr.riskScore), 0) / shipments.length)
      : 100
  };

  const healthData = [
    { name: "Healthy", value: stats.health, color: "#10B981" },
    { name: "Risk", value: 100 - stats.health, color: "#E2E8F0" },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div 
      className="flex flex-col space-y-8 pb-20 md:pb-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground bg-clip-text">
            Welcome, {user?.displayName?.split(' ')[0] || "Trader"}
          </h1>
          <p className="text-muted-foreground mt-3 text-lg font-medium opacity-80 max-w-xl">
            Real-time compliance intelligence for your global logistics network.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button onClick={() => onNavigate("shipments")} size="lg" className="w-full md:w-auto font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95 px-8">
            <Package className="mr-2 h-5 w-5" />
            New Shipment
          </Button>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants} className="col-span-1">
          <Card className="h-full relative overflow-hidden group border-none shadow-sm bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl">
            <CardContent className="pt-8 flex flex-col items-center">
              <div className="h-32 w-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={55}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={10}
                    >
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-3xl font-black font-mono tracking-tighter">{stats.health}%</span>
                </div>
              </div>
              <h3 className="mt-6 font-black text-xl tracking-tight">Compliance Health</h3>
              <div className="flex items-center gap-2 mt-2 text-xs font-bold text-primary/60 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Vetting Active
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Bento */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Fleet Volume", value: stats.active.toString(), label: "Active Nodes", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/5" },
            { title: "Route Optimization", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.savings), label: "Est. Savings", icon: BarChart3, color: "text-primary", bg: "bg-primary/5" },
            { title: "Risk Vectors", value: stats.risks.toString(), label: "Awaiting Action", icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/5" },
          ].map((stat, i) => (
            <Card key={i} className="group border-none shadow-sm rounded-3xl bg-card hover:bg-muted/50 transition-all cursor-default">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className={cn("p-2 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-4xl font-black font-mono tracking-tighter">{stat.value}</div>
                <div className="flex flex-col mt-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.title}</span>
                  <span className="text-xs font-semibold text-muted-foreground mt-0.5">{stat.label}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold">Recent Shipments</CardTitle>
                  <CardDescription className="text-sm mt-1">Latest logistics operations needing attention.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => onNavigate("shipments")}>View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No active shipments found.
                  </div>
                ) : (
                  shipments.slice(0, 3).map((shipment, idx) => (
                    <motion.div 
                      key={shipment.id} 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-3xl border border-border/40 bg-background/50 hover:bg-primary/5 transition-all cursor-pointer group/item"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-border/50 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                          <Globe2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black font-mono text-sm tracking-tight text-foreground">{shipment.externalId}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/20 bg-primary/5 text-primary">
                              {shipment.origin} → {shipment.destination}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-bold">
                              {shipment.createdAt?.toDate ? shipment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-mono font-black text-base text-foreground">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: shipment.currency || 'USD', maximumFractionDigits: 0 }).format(shipment.totalValue)}
                        </span>
                        <Badge 
                          variant={shipment.status === 'Cleared' ? 'success' : shipment.status === 'High Risk' ? 'destructive' : 'warning'} 
                          className="text-[9px] px-2 py-0 font-black uppercase tracking-widest rounded-full mt-1"
                        >
                          {shipment.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3">
          <Card className="border-none shadow-md bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Compliance Alerts</CardTitle>
              <CardDescription className="text-sm mt-1">Automated flags from the Sentrix engine.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: "Missing COO for SHP-1091", desc: "Tariff reduction at risk. Upload Certificate of Origin.", type: "warning" },
                { title: "HS Code Mismatch (SHP-1090)", desc: "Commercial invoice implies 8471.30, packing list implies 8471.50. Risk of manual audit.", type: "destructive" },
                { title: "Trans-Pacific Corridor Approved", desc: "SHP-1088 cleared for direct dispatch via Singapore.", type: "success" },
              ].map((alert, i) => (
                <div key={i} className={cn("group flex border-l-4 pl-4 py-1 flex-col transition-all hover:pl-6", 
                  alert.type === 'warning' ? "border-warning" : 
                  alert.type === 'destructive' ? "border-destructive text-destructive" : "border-success text-success"
                )}>
                  <span className={cn("text-base font-bold", alert.type === 'destructive' ? "text-destructive" : "text-foreground")}>{alert.title}</span>
                  <span className="text-sm text-muted-foreground mt-1 group-hover:text-foreground/80 leading-relaxed">{alert.desc}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-primary font-bold hover:bg-primary/5">
                Go to Compliance Hub <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
