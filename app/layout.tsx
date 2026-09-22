import type { Metadata } from "next";
import "./globals.css";
import { PromoBanner } from "@/components/PromoBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CHRONICLE KHAN",
  description: "Breaking the through the gatekeepers of knowledge through creative writing, and exclusive dossiers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f7f7f7] text-gray-900 antialiased">
        <PromoBanner />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}