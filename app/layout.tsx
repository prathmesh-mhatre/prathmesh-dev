import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";


export const metadata: Metadata = {
  title: "Prathmesh | Dev",
  description: "My personal portfolio website showcasing my projects, experiments, and learnings. Built to share my work and growth as a developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
