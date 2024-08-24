import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hemlo",
  description: "Byt semesterbostad med andra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" data-theme="bumblebee">
      <body className={inter.className}>
        <Navbar isLoggedIn={false}></Navbar>
        {children}
        <SpeedInsights></SpeedInsights>
        <Footer></Footer>
      </body>
    </html>
  );
}
