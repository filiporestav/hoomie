"use client"; // Must remain at the top

import { usePathname } from 'next/navigation';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientProvider from "./ClientProvider";

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
          <main>{children}</main>
          {pathname !== '/annonser' && <Footer />}
          <SpeedInsights />
        </ClientProvider>
      </body>
    </html>
  );
}
