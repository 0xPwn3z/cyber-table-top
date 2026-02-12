import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CyberTabletop — Incident Response Training",
  description:
    "Gamified cybersecurity tabletop exercises. Assume critical roles and make high-pressure decisions to balance Security, Business, and Reputation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#e2e8f0",
            },
          }}
        />
      </body>
    </html>
  );
}
