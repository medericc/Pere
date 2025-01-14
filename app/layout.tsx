"use client"
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";

const work_Sans = Work_Sans({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${work_Sans.className} antialiased bg-white dark:bg-[#242535] text-black dark:text-white max-w-7xl mx-auto`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
