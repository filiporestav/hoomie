"use client"; // Must remain at the top

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import "react-day-picker/dist/style.css";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientProvider from "./ClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" className={inter.className}>
      <body>
        <ClientProvider>
          <Navbar />
          <main>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
           </main>
          {pathname !== "/annonser" && <Footer />}
          <Toaster />
          <SpeedInsights />
        </ClientProvider>
      </body>
    </html>
  );
}
