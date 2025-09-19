import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { VT323, Source_Code_Pro } from 'next/font/google';

export const metadata: Metadata = {
  title: "Bug Hunters",
  description: "An online detective cyber mystery investigation game.",
  manifest: "/manifest.json",
};

const vt323 = VT323({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
  weight: '400'
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#0D110D" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          vt323.variable,
          sourceCodePro.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
