"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Search, Plus, ListFilter, Calendar, MapPin, MoreVertical, ShieldCheck, ArrowRight, Loader2, Filter, Download, ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info, FileText, Building2, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import NewShipmentFlow from "./NewShipmentFlow";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/FirebaseProvider";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

function ShipmentSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-3xl" />
      ))}
    </div>
  );
}

export default function ShipmentsView() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);

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
      console.error("Error fetching shipments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredShipments = shipments.filter(shp => {
    const term = searchTerm.toLowerCase();
    return (
      (shp.externalId || "").toLowerCase().includes(term) ||
      (shp.origin || "").toLowerCase().includes(term) ||
      (shp.destination || "").toLowerCase().includes(term) ||
      (shp.importer || "").toLowerCase().includes(term) ||
      (shp.exporter || "").toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col space-y-10 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-14 w-44 rounded-3xl" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
        <ShipmentSkeleton />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Shipment Fleet</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium opacity-80">Real-time monitoring of your regional trade corridor.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} size="lg" className="rounded-full px-8 font-bold shadow-xl shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Shipment
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, route, or company..." 
            className="pl-11 h-12 rounded-2xl bg-card border-border/40 shadow-sm focus:ring-1 focus:ring-primary/20 transition-all font-medium" 
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="h-12 rounded-2xl px-6 font-bold flex items-center gap-2 flex-1 md:flex-none border-border/40 hover:bg-muted/50">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="h-12 rounded-2xl px-6 font-bold flex items-center gap-2 flex-1 md:flex-none border-border/40 hover:bg-muted/50">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredShipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card/30 rounded-[2.5rem] border border-dashed border-border/60">
            <Package className="h-16 w-16 text-muted-foreground/20 mb-6" />
            <h3 className="text-2xl font-black tracking-tight">No match found</h3>
            <p className="text-muted-foreground mt-2 font-medium opacity-60">Try refining your search filters or start a new trace.</p>
            {searchTerm && (
              <Button 
                variant="link" 
                onClick={() => setSearchTerm("")}
                className="mt-4 font-bold text-primary"
              >
                Clear search query
              </Button>
            )}
          </div>
        ) : (
          filteredShipments.map((shp, idx) => {
            const isExpanded = expandedShipmentId === shp.id;
            return (
            <motion.div
              key={shp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card 
                onClick={() => setExpandedShipmentId(isExpanded ? null : shp.id)}
                className={cn(
                  "group border-border/30 hover:border-primary/40 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md",
                  isExpanded ? "rounded-[2rem] bg-muted/10 border-primary/30" : "rounded-[2rem] hover:bg-muted/20 active:scale-[0.99]"
                )}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">
                    <div className="flex items-center gap-5 flex-1 text-card-foreground">
                      <div className="h-16 w-16 rounded-[1.5rem] bg-white border border-border/50 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-xl font-mono tracking-tighter leading-none">{shp.externalId}</span>
                          <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest">
                            {shp.riskScore > 80 ? 'HighRisk' : shp.riskScore >= 50 ? 'MedRisk' : 'LowRisk'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-bold">
                          <span className="flex items-center gap-1.5 opacity-60"><Calendar className="w-3.5 h-3.5" /> {shp.createdAt?.toDate ? shp.createdAt.toDate().toLocaleDateString() : 'Syncing...'}</span>
                          <div className="flex items-center gap-2">
                             <MapPin className="w-3.5 h-3.5 opacity-40 text-primary" /> 
                             <span className="truncate max-w-[120px] font-black uppercase tracking-tight text-[10px]">{shp.origin}</span>
                             <ArrowRight className="w-3 h-3 opacity-30 mx-1" />
                             <span className="truncate max-w-[120px] font-black uppercase tracking-tight text-[10px] text-primary">{shp.destination}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-none pt-4 md:pt-0">
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black font-mono tracking-tighter text-foreground leading-none">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: shp.currency || 'USD', maximumFractionDigits: 0 }).format(shp.totalValue)}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1.5 opacity-50">Market Value</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={shp.status === 'Cleared' ? 'success' : shp.status === 'High Risk' ? 'destructive' : 'warning'} 
                          className="h-10 px-6 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center min-w-[110px] shadow-sm"
                        >
                          {shp.status}
                        </Badge>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-border/40 bg-card/40"
                      >
                        <div className="p-6 md:p-8 space-y-8">
                          {/* Parties */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                <Building2 className="h-4 w-4" /> Exporter
                              </h4>
                              <div className="p-4 rounded-2xl bg-card border border-border/40">
                                <p className="font-bold text-sm">{shp.exporter || "Not provided"}</p>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">{shp.origin || "Origin unknown"}</p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                <Building2 className="h-4 w-4" /> Importer
                              </h4>
                              <div className="p-4 rounded-2xl bg-card border border-border/40">
                                <p className="font-bold text-sm">{shp.importer || "Not provided"}</p>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">{shp.destination || "Destination unknown"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Classification & Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-card border border-border/40 flex flex-col gap-1">
                              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1.5"><FileText className="h-3 w-3" /> HS Code</span>
                              <span className="font-bold text-sm font-mono mt-1">{shp.hsCode || "N/A"}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border/40 flex flex-col gap-1">
                              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1.5"><Scale className="h-3 w-3" /> Incoterms</span>
                              <span className="font-bold text-sm mt-1">{shp.incoterm || "N/A"}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border/40 flex flex-col gap-1">
                              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1.5"><FileText className="h-3 w-3" /> Invoice No</span>
                              <span className="font-bold text-sm font-mono mt-1">{shp.invoiceNum || "N/A"}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-card border border-border/40 flex flex-col gap-1">
                              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Risk Score</span>
                              <span className={cn(
                                "font-black text-lg mt-0.5",
                                shp.riskScore > 80 ? "text-destructive" : shp.riskScore >= 50 ? "text-warning" : "text-success"
                              )}>{shp.riskScore || 0}/100</span>
                            </div>
                          </div>

                          {/* Compliance Issues */}
                          {shp.issues && shp.issues.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                <AlertTriangle className="h-4 w-4" /> Compliance Analysis
                              </h4>
                              <div className="grid gap-3">
                                {shp.issues.map((issue: any, i: number) => (
                                  <div key={i} className={cn(
                                    "p-4 rounded-2xl flex items-start gap-4 border",
                                    issue.type === 'error' ? "bg-destructive/5 border-destructive/20 text-destructive-foreground/90" : 
                                    issue.type === 'warning' ? "bg-warning/5 border-warning/20 text-warning-foreground" : 
                                    "bg-success/5 border-success/20 text-success-foreground"
                                  )}>
                                    <div className="shrink-0 mt-0.5">
                                      {issue.type === 'error' ? <AlertCircle className="h-5 w-5 text-destructive" /> : 
                                       issue.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-warning" /> : 
                                       <Info className="h-5 w-5 text-success" />}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="font-bold text-sm tracking-tight">{issue.title}</span>
                                      <span className="text-sm opacity-80 leading-relaxed max-w-3xl">{issue.description}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
            );
          })
        )}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center py-8"
      >
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">
          <ShieldCheck className="w-4 h-4" />
          Secured by Sentrix Cargo
        </div>
      </motion.div>
    </motion.div>
  );
}
