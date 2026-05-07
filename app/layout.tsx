import type {Metadata} from 'next';
import './globals.css';
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { FirebaseProvider } from "@/components/FirebaseProvider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Sentrix Cargo | The Trusted Engine of Global Trade',
  description: 'Powering automated, frictionless, and secure logistics operations across Africa and beyond. Experience next-gen AI compliance, real-time risk assessment, and transparent supply chain orchestration.',
  keywords: ['logistics software', 'cargo management', 'AI trade compliance', 'African trade logistics', 'global trade OS', 'AfCFTA compliance', 'automated customs', 'supply chain AI'],
  authors: [{ name: 'Sentrix Cargo' }],
  openGraph: {
    title: 'Sentrix Cargo | The Trusted Engine of Global Trade',
    description: 'Powering automated, frictionless, and secure logistics operations across Africa and beyond.',
    type: 'website',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, outfit.variable, jetBrainsMono.variable)} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
