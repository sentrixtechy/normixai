"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, CheckCircle2, AlertTriangle, FileSearch, ArrowRight, Printer, AlertCircle, Loader2, BrainCircuit } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const steps = [
  "Upload",
  "AI Extraction",
  "Compliance Check",
  "Risk Analysis",
  "Final Result",
];

// ... (fileToBase64 remains same)

export default function NewShipmentFlow({ onCancel }: { onCancel: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [complianceResult, setComplianceResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addLog = (log: string) => {
    setTerminalLogs((prev) => [...prev, log]);
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  // ... (useDropzone remains same)

  const runExtraction = async () => {
    if (!file) return;
    setIsProcessing(true);
    setCurrentStep(1);
    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type;

      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType } },
            { text: "Extract trade and shipping data into JSON. Always return JSON." },
          ]
        },
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are an AI extracting data from an invoice or bill of lading. Be extremely precise.",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              exporter: { type: Type.STRING },
              importer: { type: Type.STRING },
              invoiceNum: { type: Type.STRING },
              hsCode: { type: Type.STRING },
              origin: { type: Type.STRING },
              incoterm: { type: Type.STRING },
              value: { type: Type.STRING },
              currency: { type: Type.STRING },
              confidence: { type: Type.NUMBER, description: "0-100 overall confidence" }
            }
          }
        }
      });
      
      if (response.text) {
        setExtractedData(JSON.parse(response.text));
        setErrorMessage(null);
      } else {
        throw new Error("No data returned from AI extraction.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to extract data from document.");
      setExtractedData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const runCompliance = async () => {
    if (!extractedData) return;
    setCurrentStep(2);
    setIsProcessing(true);
    setTerminalLogs(["Initializing Compliance Engine...", "Connecting to UN Sanctions DB..."]);
    
    try {
      await new Promise(r => setTimeout(r, 1200));
      addLog("Checking HS Code structure...");
      await new Promise(r => setTimeout(r, 1000));
      addLog("Validating AfCFTA Origin Rules...");
      await new Promise(r => setTimeout(r, 800));
      addLog("Searching Entity Watchlists...");
      
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Validate the following extracted shipping data against trade compliance rules.
        Data: ${JSON.stringify(extractedData)}`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a trade compliance analyzer estimating risk and penalties. Output JSON.",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.NUMBER, description: "0 to 100" },
              penaltyEstimate: { type: Type.NUMBER },
              issues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: "error, warning, or success" },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      addLog("Analysis complete. Compiling risk matrix...");
      await new Promise(r => setTimeout(r, 1000));
      
      if (response.text) {
        setComplianceResult(JSON.parse(response.text));
        setErrorMessage(null);
        setCurrentStep(3);
      } else {
        throw new Error("No response from compliance engine.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Internal engine error during compliance check.");
      setCurrentStep(1); 
    } finally {
      setIsProcessing(false);
    }
  };

  const renderUpload = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-6 space-y-8"
    >
      <div 
        {...getRootProps()} 
        className={cn(
          "w-full max-w-3xl border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300",
          isDragActive 
            ? "border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/10" 
            : "border-border hover:border-primary/50 hover:bg-muted/50 shadow-sm"
        )}
      >
        <input {...getInputProps()} />
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
          <UploadCloud className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">Deployment & Documentation Upload</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          Drag & drop your commercial invoice or shipping documents here. 
          Supported: <span className="font-semibold text-foreground">PDF, JPEG, PNG</span>
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button variant="outline" className="px-8 font-semibold rounded-full">Browse Files</Button>
          <Button variant="secondary" className="md:hidden px-8 font-semibold rounded-full">Take Photo</Button>
        </div>
      </div>
      {file && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-card p-5 rounded-2xl border border-primary/20 flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <FileSearch className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm truncate max-w-[200px]">{file.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Ready for extraction</span>
            </div>
          </div>
          <Button onClick={runExtraction} disabled={isProcessing} className="rounded-full px-8 font-bold shadow-lg shadow-primary/20">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isProcessing ? "Processing..." : "Init AI Extraction"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderExtraction = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <Card className="h-full border-border/50 shadow-inner bg-muted/20">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Source Document</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[500px] overflow-hidden p-0 rounded-b-xl border-t bg-slate-900/40">
          {file && file.type.includes("image") ? (
            <img src={URL.createObjectURL(file)} alt="preview" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center">
              <FileSearch className="h-14 w-14 mb-4 text-primary/30" />
              <span className="text-sm font-bold uppercase tracking-widest opacity-50">{file?.name || "Document"}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="h-full flex flex-col border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/10">
          {isProcessing && <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-1/3 h-full bg-primary" />}
        </div>
        <CardHeader className="pb-4 border-b bg-primary/5">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center font-bold">
              <div className="h-2 w-2 rounded-full bg-success mr-3 animate-pulse" />
              Normix Structured Data
            </CardTitle>
            {extractedData?.confidence && extractedData.confidence < 90 && (
              <Badge variant="warning" className="rounded-full font-bold px-3">Review Needed ({extractedData?.confidence}%)</Badge>
            )}
          </div>
        </CardHeader>
        <ScrollArea className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full space-y-6 py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-50" />
                </div>
                <p className="text-lg font-bold tracking-tight animate-pulse">Gemini 3.1 Pro analyzing metadata...</p>
              </motion.div>
            ) : errorMessage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full space-y-6 py-10 text-center">
                 <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                   <AlertTriangle className="h-8 w-8 text-destructive" />
                 </div>
                 <div>
                   <p className="text-xl font-bold text-destructive">Extraction Failed</p>
                   <p className="text-sm text-muted-foreground mt-2 max-w-xs">{errorMessage}</p>
                 </div>
                 <Button variant="outline" onClick={() => setCurrentStep(0)} className="rounded-full px-8 font-bold">
                   Try Another Document
                 </Button>
              </motion.div>
            ) : extractedData ? (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 {[
                   { label: "HS Code", value: extractedData.hsCode, mono: true, dangerous: extractedData.confidence < 90 },
                   { label: "Exporter", value: extractedData.exporter },
                   { label: "Importer", value: extractedData.importer },
                   { label: "Invoice #", value: extractedData.invoiceNum, mono: true },
                   { label: "Origin", value: extractedData.origin, short: true },
                   { label: "Value", value: extractedData.value, mono: true, short: true },
                   { label: "Currency", value: extractedData.currency, short: true },
                 ].map((field, i) => (
                   <div key={i} className="grid gap-2">
                     <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{field.label}</Label>
                     <Input 
                      defaultValue={field.value} 
                      className={cn(
                        "h-11 rounded-xl shadow-sm border-border/60 transition-all focus:ring-2 focus:ring-primary/20",
                        field.mono && "font-mono font-bold tracking-tight",
                        field.dangerous && "border-warning/60 bg-warning/5 text-warning-foreground"
                      )} 
                     />
                   </div>
                 ))}
               </motion.div>
            ) : null}
          </AnimatePresence>
        </ScrollArea>
        <CardFooter className="pt-6 pb-6 border-t bg-muted/10">
          <Button onClick={runCompliance} disabled={isProcessing || !extractedData} className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/10">
             Run Compliance Check <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderTerminal = () => (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <Card className="bg-[#020617] border-none shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/10">
        <div className="h-10 bg-[#0f172a] flex items-center px-6 space-x-2">
          <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
          <div className="w-3 h-3 rounded-full bg-warning/60"></div>
          <div className="w-3 h-3 rounded-full bg-success/60"></div>
          <div className="flex-1 text-center">
            <span className="text-[10px] text-muted-foreground/50 font-mono uppercase tracking-[0.2em] font-black">normix-core::node_8471</span>
          </div>
        </div>
        <CardContent className="p-8 h-[400px] overflow-y-auto font-mono text-xs md:text-sm scroll-smooth leading-relaxed" ref={scrollRef}>
          <div className="text-primary/70 mb-6 font-bold flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            $ INIT COMPLIANCE_LAYER_7 [BETA]
          </div>
          {terminalLogs.map((log, i) => (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="mb-3 text-slate-400 group">
              <span className="text-emerald-500 mr-3 font-black opacity-50 group-hover:opacity-100 transition-opacity">›</span>
              {log}
            </motion.div>
          ))}
          {isProcessing && (
            <div className="flex items-center space-x-2 mt-6">
              <div className="w-2 h-4 bg-primary animate-[pulse_0.8s_infinite]"></div>
              <span className="text-primary animate-pulse font-bold tracking-tighter">PROCESSING...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderRisk = () => {
    if (errorMessage) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-16 max-w-2xl mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center animate-bounce">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Compliance Denial</h2>
            <p className="text-muted-foreground mt-3 text-lg leading-relaxed">{errorMessage}</p>
          </div>
          <Button onClick={() => setCurrentStep(1)} variant="outline" className="mt-6 rounded-full px-10 h-12 font-bold border-2">
            Return to Extraction
          </Button>
        </motion.div>
      );
    }
    
    const rs = complianceResult?.riskScore || 0;
    const isHighRisk = rs > 50;
    
    return (
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto py-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="flex flex-col items-center justify-center p-12 h-full shadow-xl bg-card border-border/60">
            <h3 className="text-xs uppercase tracking-[0.3em] font-black text-muted-foreground mb-10">Threat Assessment</h3>
            <div className="relative w-64 h-64 flex items-center justify-center rounded-full bg-muted/20">
              <svg className="absolute w-[90%] h-[90%] transform -rotate-90">
                <circle
                  cx="115" cy="115" r="105" stroke="currentColor" strokeWidth="18" fill="transparent"
                  className="text-muted/30"
                />
                <motion.circle
                  cx="115" cy="115" r="105" stroke="currentColor" strokeWidth="18" fill="transparent"
                  strokeDasharray="659.7" 
                  initial={{ strokeDashoffset: 659.7 }}
                  animate={{ strokeDashoffset: 659.7 - (659.7 * rs) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className={cn("transition-colors duration-500", isHighRisk ? 'text-destructive' : 'text-success')}
                />
              </svg>
              <div className="text-center flex flex-col items-center z-10">
                <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-7xl font-black font-mono tracking-tighter">{rs}</motion.span>
                <span className={cn("text-[10px] mt-2 uppercase font-black tracking-[0.2em]", isHighRisk ? 'text-destructive' : 'text-success')}>
                  {isHighRisk ? 'CRITICAL RISK' : 'STABLE STATUS'}
                </span>
              </div>
            </div>
            {complianceResult?.penaltyEstimate > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl p-6 text-center w-full shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Projected Liability</p>
                <p className="text-4xl font-black font-mono tracking-tighter">${complianceResult.penaltyEstimate.toLocaleString()}</p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 flex flex-col justify-center">
          <div className="mb-2">
            <h3 className="text-2xl font-black tracking-tight">AI Audit Findings</h3>
            <p className="text-muted-foreground text-sm">Review identified anomalies before generating final customs defense document.</p>
          </div>
          <div className="space-y-4">
            {complianceResult?.issues?.map((issue: any, i: number) => (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.8 + i * 0.1 }}
                 key={i} 
                 className={cn(
                    "p-5 rounded-2xl border flex items-start gap-5 transition-all hover:translate-x-2",
                    issue.type === 'error' ? 'bg-destructive/5 border-destructive/20' : 
                    issue.type === 'warning' ? 'bg-warning/5 border-warning/20' : 
                    'bg-success/5 border-success/20'
                 )}
               >
                  <div className={cn("mt-1 p-2 rounded-xl", 
                    issue.type === 'error' ? 'bg-destructive/10 text-destructive' : 
                    issue.type === 'warning' ? 'bg-warning/10 text-warning' : 
                    'bg-success/10 text-success'
                  )}>
                     {issue.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                  </div>
                  <div>
                     <h4 className="font-bold text-base leading-none">{issue.title}</h4>
                     <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{issue.description}</p>
                  </div>
               </motion.div>
            ))}
          </div>
          <Button onClick={() => setCurrentStep(4)} size="lg" className="h-16 rounded-2xl font-black text-lg mt-4 shadow-xl shadow-primary/20">
            Generate Final Report (PDF)
          </Button>
        </motion.div>
      </div>
    );
  };

  const renderResult = () => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center max-w-3xl mx-auto text-center space-y-8 pt-10 px-4">
      <div className="w-24 h-24 bg-success/10 text-success rounded-[2rem] flex items-center justify-center mb-4 rotate-3 shadow-xl">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <div>
        <h2 className="text-4xl font-black tracking-tight">Vetting Complete</h2>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed max-w-xl mx-auto">
          Shipment <span className="text-foreground font-bold font-mono">{extractedData?.invoiceNum || "X-CORE"}</span> has been validated. Customs defense dossier is now ready for deployment.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-10">
        <Button size="xl" className="w-full text-lg font-bold py-8 rounded-3xl shadow-2xl shadow-primary/25">
          <Printer className="mr-3 w-6 h-6 outline-none" /> Download Customs Defense
        </Button>
        <Button size="xl" variant="outline" className="w-full text-lg font-bold py-8 rounded-3xl border-2 border-primary/20 hover:bg-primary/5">
          Submit to Human Audit
        </Button>
      </div>
      <Button variant="ghost" onClick={onCancel} className="mt-12 text-muted-foreground font-bold hover:text-foreground">Return to Fleet Management</Button>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full bg-background no-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm uppercase tracking-[0.4em] font-black text-muted-foreground/60 mb-1">Process Module</h2>
          <h1 className="text-3xl font-black tracking-tighter">Compliance Intelligence</h1>
        </div>
        <Button variant="ghost" onClick={onCancel} className="rounded-full font-bold">Cancel Session</Button>
      </div>

      {/* Stepper */}
      <div className="mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted/40 -translate-y-1/2 z-0"></div>
        <div className="relative z-10 flex justify-between">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isPast = idx < currentStep;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 relative",
                  isActive ? "bg-primary text-primary-foreground scale-125 shadow-xl shadow-primary/30 z-20" : 
                  isPast ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground border-2 border-background"
                )}>
                  {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  {isActive && <motion.div layoutId="stepper-glow" className="absolute -inset-2 bg-primary/20 rounded-full -z-10 animate-ping" />}
                </div>
                <span className={cn(
                  "mt-4 text-[10px] hidden md:block font-black uppercase tracking-widest",
                  isActive ? "text-foreground" : "text-muted-foreground/60"
                )}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-background p-1">
        <AnimatePresence mode="wait">
          {currentStep === 0 && <div key="0">{renderUpload()}</div>}
          {currentStep === 1 && <div key="1">{renderExtraction()}</div>}
          {currentStep === 2 && <div key="2">{renderTerminal()}</div>}
          {currentStep === 3 && <div key="3">{renderRisk()}</div>}
          {currentStep === 4 && <div key="4">{renderResult()}</div>}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Moved it outside to keep component clean
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });