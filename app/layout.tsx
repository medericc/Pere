
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
const work_Sans = Work_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BibleEnMain – Pères de l'Église, Docteurs, Jean-Paul II, Benoît XVI",
  description: "Accédez aux écrits des Pères de l'Église, aux textes des Docteurs de l'Église, à la pensée de Jean-Paul II et Benoît XVI, commentés et expliqués.",
  keywords: [
    "Pères de l'Église",
    "Docteurs de l'Église",
    "Jean-Paul II",
    "Benoît XVI",
    "Théologie",
    "Spiritualité catholique",
    "Écrits des pères",
    "Encycliques",
    "Foi chrétienne",
    "Bible",
    "Tradition chrétienne"
  ],
  authors: [{ name: "BibleEnMain", url: "https://www.sourcetheologique.com/" }],
  openGraph: {
    title: "BibleEnMain – Trésor des Écrits Catholiques",
    description: "Découvrez les trésors de la Tradition chrétienne : Pères de l'Église, Docteurs, papes modernes.",
    url: "https://www.sourcetheologique.com/",
    siteName: "BibleEnMain",
    images: [
      {
        url: "https://www.sourcetheologique.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "BibleEnMain – Écrits patristiques et contemporains",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bibleenmain",
    creator: "@bibleenmain",
    title: "BibleEnMain – Textes de la Tradition chrétienne",
    description: "Explorez les écrits patristiques, magistériels et spirituels de la tradition catholique.",
    images: ["https://www.sourcetheologique.com/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "google-adsense-account": "ca-pub-6915108633693700",
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
