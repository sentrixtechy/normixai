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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Trade Intelligence</h1>
            <p className="text-muted-foreground mt-3 text-lg font-medium opacity-80 max-w-xl">AI-powered analytics from across the global trade network.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" className="h-12 rounded-2xl px-6 font-bold flex-1 md:flex-none border-border/40 hover:bg-muted/50">
              <Mail className="mr-2 h-4 w-4" /> Subscribe
            </Button>
            <Button className="h-12 rounded-2xl px-6 font-bold shadow-lg shadow-primary/20 flex-1 md:flex-none">
              Intelligence Report
            </Button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[2.5rem] bg-card/50 overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-black tracking-tighter">Supply Chain Performance</CardTitle>
                <CardDescription className="font-medium">Cross-border latency vs. Logistics overhead (Major Hubs)</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cost Factor</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Speed (Latency)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-0">
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 700 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "24px", border: "1px solid #E2E8F0", boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)", backdropFilter: "blur(10px)", padding: "20px" }}
                    labelStyle={{ fontWeight: 900, marginBottom: "8px", textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.2em", color: "#64748B" }}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#0284C7" strokeWidth={4} fillOpacity={1} fill="url(#colorCost)" />
                  <Area type="monotone" dataKey="speed" stroke="#F59E0B" strokeWidth={4} fillOpacity={1} fill="url(#colorSpeed)" />
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
              { title: "Suez Canal Rerouting", desc: "Congestion latency adds 4.2 median days. Dynamic routing saves ~$1,450/TEU.", imp: "High" },
              { title: "Global Tariff Update", desc: "New tariff exemption for electronics manufacturing components. Review HS mapping.", imp: "Medium" },
              { title: "FX Liquidity Alert", desc: "EUR/USD volatility impacting global clearing houses. Ensure stablecoin or USD settlements.", imp: "Critical" },
            ].map((insight, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-5 rounded-3xl bg-background/50 border border-border/40 hover:border-primary/40 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-sm tracking-tight group-hover:text-primary transition-colors leading-none">{insight.title}</span>
                  <Badge variant={insight.imp === 'Critical' ? 'destructive' : insight.imp === 'High' ? 'warning' : 'outline'} className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                    {insight.imp}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold opacity-70 group-hover:opacity-100 transition-opacity">{insight.desc}</p>
              </motion.div>
            ))}
            <Button variant="ghost" className="w-full text-primary font-black uppercase tracking-widest text-[11px] hover:bg-primary/5 h-14 rounded-2xl group transition-all">
              Comprehensive Intelligence <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Market Volatility", value: "Low", sub: "Stable trade routes", icon: Globe },
          { label: "Clearing Index", value: "92/100", sub: "Regional top tier", icon: BarChart3 },
          { label: "Avg. Savings", value: "14.2%", sub: "Route optimization", icon: Zap },
          { label: "Live Alerts", value: "3", sub: "Active risk nodes", icon: TrendingUp },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Card className="h-full border-none shadow-sm rounded-3xl bg-card hover:bg-muted/50 transition-all cursor-default group overflow-hidden">
              <CardContent className="pt-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Globe className="w-4 h-4 text-primary/20 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/60">{stat.label}</span>
                  <span className="text-4xl font-black font-mono tracking-tighter mt-1 text-foreground">{stat.value}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <span className="text-xs font-bold text-muted-foreground opacity-80">{stat.sub}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
