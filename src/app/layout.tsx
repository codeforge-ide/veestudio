import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeeStudio - VeChain IDE",
  description: "AI-native IDE for VeChain smart contract development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
