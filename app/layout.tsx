import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginPopup from "@/components/LoginPopup";
import { GoogleAnalytics } from "@next/third-parties/google";

const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Property for Sale in Noida | Real Estate Consultant | Nexique Estate | NEHA",
  description: "Nexique Estate is a trusted real estate consultant in Noida, offering residential and commercial properties for sale and investment.",
  keywords: [
    "Property for Sale in Noida",
    "Flats for Sale in Noida",
    "Property Dealer in Noida",
    "Real Estate Consultant in Noida",
    "Residential Property Noida",
    "Commercial Property Noida",
    "RERA Approved Projects Noida",
    "Nexique Estate",
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  verification: {
    google: "ZYl48fTZd4_6lNW5iMjUWA9EJZmbw_aV4mkul38eYkU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexendDeca.variable} ${lexendDeca.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LoginPopup />
        <Header />
        <main className="flex-1" suppressHydrationWarning>{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-FRPVKQRKHC" />
      </body>
    </html>
  );
}
