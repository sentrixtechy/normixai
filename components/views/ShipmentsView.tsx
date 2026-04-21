"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Plus, ListFilter, Calendar, MapPin, MoreVertical, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import NewShipmentFlow from "./NewShipmentFlow";
import { cn } from "@/lib/utils";

const allShipments = [
  { id: "SHP-1092", date: "Oct 15, 2023", origin: "Shenzhen, CN", dest: "Lagos, NG", value: "$42,500", status: "Cleared", statusColor: "success", risk: "Low" },
  { id: "SHP-1091", date: "Oct 14, 2023", origin: "Dubai, AE", dest: "Accra, GH", value: "$12,000", status: "Under Review", statusColor: "warning", risk: "Medium" },
  { id: "SHP-1090", date: "Oct 12, 2023", origin: "Mumbai, IN", dest: "Nairobi, KE", value: "$105,200", status: "High Risk", statusColor: "destructive", risk: "High" },
  { id: "SHP-1089", date: "Oct 10, 2023", origin: "Johannesburg, ZA", dest: "Luanda, AO", value: "$8,300", status: "Cleared", statusColor: "success", risk: "Low" },
  { id: "SHP-1088", date: "Oct 08, 2023", origin: "Dar es Salaam, TZ", dest: "Kigali, RW", value: "$21,100", status: "Cleared", statusColor: "success", risk: "Low" },
];

export default function ShipmentsView() {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return <NewShipmentFlow onCancel={() => setIsCreating(false)} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter">Shipment Fleet</h1>
          <p className="text-muted-foreground mt-2 text-base">Monitor and manage your trade compliance across the continent.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} size="lg" className="rounded-full px-8 font-bold shadow-xl shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Shipment
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ID, route, or importer..." className="pl-11 h-12 rounded-2xl bg-card border-border/60 shadow-sm" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="h-12 rounded-2xl px-6 font-semibold flex items-center gap-2 flex-1 md:flex-none">
            <ListFilter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="h-12 rounded-2xl px-6 font-semibold flex items-center gap-2 flex-1 md:flex-none">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {allShipments.map((shp, idx) => (
          <motion.div
            key={shp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="group border-border/50 hover:border-primary/40 transition-all hover:bg-muted/30 cursor-pointer overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <Package className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg tracking-tighter text-foreground">{shp.id}</span>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-background/50 border-border/40">
                          {shp.risk} Risk
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {shp.date}</span>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> 
                          <span className="truncate max-w-[80px]">{shp.origin}</span>
                          <ArrowRight className="w-3 h-3 opacity-50" />
                          <span className="truncate max-w-[80px]">{shp.dest}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-none pt-4 md:pt-0">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black font-mono tracking-tight">{shp.value}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Est. Value</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant={shp.statusColor as any} className="h-10 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center">
                        {shp.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center py-8"
      >
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">
          <ShieldCheck className="w-4 h-4" />
          Secured by Normix AI
        </div>
      </motion.div>
    </motion.div>
  );
}
