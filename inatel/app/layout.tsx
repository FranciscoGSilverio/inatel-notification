import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inatel - Notas",
  description: "Sistema de notas da Inatel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <header
          className="w-full"
          style={{
            background: "radial-gradient(circle at 20%, #007ce1, #015294, #015eab)",
          }}
        >
          <div className="container mx-auto px-4 py-4">
            <Image
              src="/assets/Inatel Branco.png"
              alt="Inatel Logo"
              width={120}
              height={40}
              priority
            />
          </div>
        </header>
        {children}
      </body>
    </html>
  );  
}
