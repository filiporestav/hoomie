import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Semesterbyte",
  description: "Byt semesterbostad med andra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <Navbar />
        {children}
        <SpeedInsights />
        <Footer />
      </body>
    </html>
  );
}
