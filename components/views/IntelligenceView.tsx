"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { TrendingUp, Globe, Zap, ListFilter, ArrowRight, BarChart3, Mail, Lightbulb } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const marketData = [
  { name: "Jan", cost: 4000, speed: 12 },
  { name: "Feb", cost: 3000, speed: 14 },
  { name: "Mar", cost: 2000, speed: 11 },
  { name: "Apr", cost: 2780, speed: 10 },
  { name: "May", cost: 1890, speed: 9 },
  { name: "Jun", cost: 2390, speed: 8 },
  { name: "Jul", cost: 3490, speed: 10 },
];

export default function IntelligenceView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter">Market Intelligence</h1>
          <p className="text-muted-foreground mt-2 text-base">AI-powered insights into pan-African trade routes and regulations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 font-bold">
            <Mail className="mr-2 h-4 w-4" /> Subscribe
          </Button>
          <Button className="rounded-full px-6 font-bold shadow-xl shadow-primary/20">
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden bg-card/50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Supply Chain Performance</CardTitle>
                <CardDescription>Average clearing time vs. logistics cost (East Africa Corridor)</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">Cost ($)</Badge>
                <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20 font-bold">Speed (Days)</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#118B64" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#118B64" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#118B64" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                  <Area type="monotone" dataKey="speed" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpeed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-secondary/5 h-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Strategic Optimization
            </CardTitle>
            <CardDescription>AI-generated recommendations for your fleet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { title: "Switch to Berbera Port", desc: "Current congestion at Djibouti Port adds 4 median days. Optimization saves ~$1,200/container.", imp: "High" },
              { title: "AfCFTA Rule Change", desc: "New tariff reductions for manufactured electronics. Update 8471 HS Code mapping.", imp: "Medium" },
              { title: "Currency Hedge Alert", desc: "KES volatility detected. Consider USD-denominated invoicing for next 30 days.", imp: "Critical" },
            ].map((insight, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-5 rounded-2xl bg-background border border-border/60 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{insight.title}</span>
                  <Badge variant={insight.imp === 'Critical' ? 'destructive' : insight.imp === 'High' ? 'warning' : 'outline'} className="text-[10px] font-black tracking-widest uppercase">
                    {insight.imp}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{insight.desc}</p>
              </motion.div>
            ))}
            <Button variant="ghost" className="w-full text-primary font-bold hover:bg-primary/5 h-12 rounded-xl">
              See All Insights <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Market Volatility", value: "Low", sub: "Stable trade corridor", icon: Globe },
          { label: "Clearing Index", value: "92/100", sub: "Regional top tier", icon: BarChart3 },
          { label: "Avg. Savings", value: "14.2%", sub: "AfCFTA optimization", icon: Zap },
          { label: "Live Alerts", value: "3", sub: "Active risk nodes", icon: TrendingUp },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Card className="h-full border-border/50 hover:bg-muted/20 transition-all cursor-default">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">{stat.label}</span>
                  <span className="text-3xl font-black tracking-tight mt-1">{stat.value}</span>
                  <span className="text-xs font-semibold text-muted-foreground mt-1">{stat.sub}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
