"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, Landmark } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export default function BillingView() {
  const plans = [
    {
      name: "Starter",
      price: "$20",
      period: "per user/month",
      description: "Essential tools for small logistics operations.",
      features: [
        "Up to 50 active shipments",
        "Basic compliance analysis",
        "Document storage (10GB)",
        "Email support",
      ]
    },
    {
      name: "Pro",
      price: "$99",
      period: "per user/month",
      description: "Advanced global trade features for growing teams.",
      features: [
        "Unlimited active shipments",
        "Advanced AI risk scoring",
        "Real-time customs alerts",
        "Document storage (100GB)",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored pricing",
      description: "Dedicated nodes and highest global security.",
      features: [
        "Custom deployment & nodes",
        "Unlimited storage & API",
        "Dedicated account manager",
        "SLA guarantees",
        "Custom ML models",
      ]
    }
  ];

  const paymentMethods = [
    { name: "M-Pesa", region: "East Africa", domain: "safaricom.co.ke" },
    { name: "Flutterwave", region: "Pan-Africa", domain: "flutterwave.com" },
    { name: "Paystack", region: "West/South Africa", domain: "paystack.com" },
    { name: "Airtel Money", region: "Multiple Regions", domain: "airtel.africa" },
    { name: "MTN Mobile Money", region: "Multiple Regions", domain: "mtn.com" },
    { name: "Visa / Mastercard", region: "Global", domain: "visa.com" },
    { name: "Bank Transfer (EFT)", region: "Global", domain: null }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Billing & Plans</h1>
        <p className="text-muted-foreground mt-3 text-lg font-medium opacity-80 max-w-3xl">
          Scale your global logistics operations seamlessly. Start with what you need, upgrade as your trade network expands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <Card key={i} className={`relative flex flex-col border ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'border-border/40 hover:border-primary/30 transition-colors'}`}>
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 uppercase tracking-widest text-[10px]">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                <span className="text-sm font-semibold text-muted-foreground">{plan.period}</span>
              </div>
              <CardDescription className="font-medium mt-4">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-semibold opacity-90">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant={plan.popular ? "default" : "outline"} className="w-full font-bold h-12 rounded-xl">
                {plan.price === "Custom" ? "Contact Sales" : "Choose Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border/40">
        <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" /> Supported Payment Methods
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paymentMethods.map((method, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-card border border-border/40 flex items-center gap-4">
              <div className="relative h-10 w-10 shrink-0 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm overflow-hidden">
                {method.domain ? (
                  <Image 
                    src={`https://logo.clearbit.com/${method.domain}`} 
                    alt={`${method.name} logo`}
                    fill
                    className="object-contain p-1"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Landmark className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm leading-tight text-foreground">{method.name}</span>
                <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mt-0.5">{method.region}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
