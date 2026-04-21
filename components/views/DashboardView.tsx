"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Package, ShieldAlert, ArrowRight, FileText, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";

const recentShipments = [
  { id: "SHP-1092", date: "Today", value: "$42,500", currency: "KES 5.5M", status: "Cleared", statusColor: "success" },
  { id: "SHP-1091", date: "Yesterday", value: "$12,000", currency: "NGN 13.8M", status: "Under Review", statusColor: "warning" },
  { id: "SHP-1090", date: "Oct 12", value: "$105,200", currency: "KES 13.6M", status: "High Risk", statusColor: "destructive" },
];

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
  const healthData = [
    { name: "Healthy", value: 85, color: "#10B981" },
    { name: "Risk", value: 15, color: "#E2E8F0" },
  ];

  return (
    <motion.div 
      className="flex flex-col space-y-8 pb-20 md:pb-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Welcome back, Babatunde</h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">Here is your trade compliance summary for this week.</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button onClick={() => onNavigate("shipments")} size="lg" className="w-full md:w-auto font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95 px-8">
            <Package className="mr-2 h-5 w-5" />
            New Shipment
          </Button>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Health Score Card */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-1">
          <Card className="h-full pt-6 pb-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center relative">
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pt-2">
                <span className="text-4xl font-bold text-foreground">85<span className="text-lg text-muted-foreground">%</span></span>
              </div>
              <h3 className="mt-4 font-bold text-lg text-foreground">Global Health</h3>
              <p className="text-sm text-muted-foreground text-center mt-1 px-4">Overall compliance confidence across borders.</p>
              
              <div className="absolute top-2 right-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="w-4 h-4 fill-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Active Shipments", value: "12", sub: "+2 from last week", icon: Package, trend: true },
            { title: "AfCFTA Savings", value: "$14,200", sub: "KES 1.8M", icon: FileText, mono: true },
            { title: "Risks Flagged", value: "3", sub: "Requires review today", icon: ShieldAlert, warning: true },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="h-full hover:border-primary/30 transition-all hover:translate-y-[-2px]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={cn("h-5 w-5", stat.warning ? "text-warning" : "text-primary")} />
                </CardHeader>
                <CardContent>
                  <div className={cn("text-4xl font-black", stat.mono && "font-mono")}>{stat.value}</div>
                  {stat.trend ? (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-success" />
                      <span className="text-success font-bold mr-1">+2</span> new
                    </p>
                  ) : (
                    <p className={cn("text-sm text-muted-foreground mt-2", stat.mono && "font-mono")}>{stat.sub}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
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
                {recentShipments.map((shipment, idx) => (
                  <motion.div 
                    key={shipment.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold font-mono text-sm tracking-tight">{shipment.id}</span>
                        <span className="text-xs text-muted-foreground font-medium">{shipment.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-base">{shipment.value}</span>
                        <Badge variant={shipment.statusColor as any} className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">
                          {shipment.status}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono font-semibold mt-1">{shipment.currency}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3">
          <Card className="border-none shadow-md bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Compliance Alerts</CardTitle>
              <CardDescription className="text-sm mt-1">Automated flags from the Normix engine.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: "Missing COO for SHP-1091", desc: "AfCFTA tariff reduction at risk. Upload Certificate of Origin.", type: "warning" },
                { title: "HS Code Mismatch (SHP-1090)", desc: "Commercial invoice implies 8471.30, packing list implies 8471.50. Risk of manual audit.", type: "destructive" },
                { title: "Tanzania Corridor Approved", desc: "SHP-1088 cleared for direct dispatch via Dar es Salaam.", type: "success" },
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
