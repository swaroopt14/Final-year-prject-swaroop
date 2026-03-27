import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Decision Operating System for Hospitals",
  description: "Multi-agent hospital intelligence dashboard for doctors, nurses, drug safety, and operations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
