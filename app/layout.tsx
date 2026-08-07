import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginPopup from "@/components/LoginPopup";

const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEHA - Nexique Estate Housing Advisors",
  description: "Your trusted real estate partner in Delhi NCR - RERA approved residential & commercial projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexendDeca.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LoginPopup />
        <Header />
        <main className="flex-1" suppressHydrationWarning>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
