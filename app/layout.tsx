import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SmoothScroll from "./SmoothScroll";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import { SITE_URL } from "./site-config";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sunray Myanmar | Education Group",
    template: "%s | Sunray Myanmar",
  },
  description: "Shaping bright futures through quality education",
  keywords: [
    "Sunray Myanmar",
    "free education Myanmar",
    "vocational training Myanmar",
    "English course Myanmar",
    "Sunray Education Group",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Sunray Myanmar",
    title: "Sunray Myanmar | Education Group",
    description: "Shaping bright futures through quality education",
    images: ["/social_sharing.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunray Myanmar | Education Group",
    description: "Shaping bright futures through quality education",
    images: ["/social_sharing.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <SmoothScroll />
        <CustomCursor />
        {children}
        <Footer />
      </body>
    </html>
  );
}
