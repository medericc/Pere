
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
const work_Sans = Work_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BibleEnMain - Découvrez les Écrits des Pères de l'Église",
  description: "Explorez les Écrits des Pères de l'Église en un seul endroit.",
  keywords: ["Bible", "Saints", "Histoires Bibliques", "Religion", "Spiritualité"],
  authors: [{ name: "BibleEnMain", url: "https://livrebiblique.vercel.app/" }],
  openGraph: {
    title: "BibleEnMain - Découvrez les Écrits des Pères de l'Église",
    description: "Plongez dans les Ecrits des Pères de l'Église avec des résumés et explications détaillées.",
    url: "https://livrebiblique.vercel.app/",
    siteName: "BibleEnMain",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BibleEnMain - Découvrez les Écrits des Pères de l'Église",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bibleenmain",
    creator: "@bibleenmain",
    title: "BibleEnMain - Découvrez les Écrits des Pères de l'Église",
    description: "Explorez les écris des Pères de l'Église en un seul endroit.",
    images: ["/apple-touch-icon.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "google-adsense-account": "ca-pub-6915108633693700", // Ajout ici !
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
      <meta name="google-adsense-account" content="ca-pub-6915108633693700" />
    
      <link rel="icon" type="image/png" href="/favicon.png" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
         <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#242535" media="(prefers-color-scheme: dark)" />
  ...
        
      </head>
      <body
        className={`${work_Sans.className} antialiased bg-white dark:bg-[#242535] text-black dark:text-white  mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
