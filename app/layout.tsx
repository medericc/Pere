
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";

const work_Sans = Work_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BibleEnMain - Découvrez les Saints & Histoires Bibliques",
  description: "Explorez les vies des Saints et les résumés des histoires bibliques en un seul endroit.",
  keywords: ["Bible", "Saints", "Histoires Bibliques", "Religion", "Spiritualité"],
  authors: [{ name: "BibleEnMain", url: "https://ton-site.com" }],
  openGraph: {
    title: "BibleEnMain - Découvrez les Saints & Histoires Bibliques",
    description: "Plongez dans la Bible et les vies des Saints avec des résumés et explications détaillées.",
    url: "https://ton-site.com",
    siteName: "BibleEnMain",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BibleEnMain - Découvrez les Saints & Histoires Bibliques",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bibleenmain",
    creator: "@bibleenmain",
    title: "BibleEnMain - Découvrez les Saints & Histoires Bibliques",
    description: "Explorez les vies des Saints et les résumés des histoires bibliques en un seul endroit.",
    images: ["/apple-touch-icon.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${work_Sans.className} antialiased bg-white dark:bg-[#242535] text-black dark:text-white max-w-7xl mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
