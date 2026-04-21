import type {Metadata} from 'next';
import './globals.css';
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Normix AI - Trade Compliance OS',
  description: 'AI-powered Trade Compliance Operating System for African businesses.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, jetBrainsMono.variable)}>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
