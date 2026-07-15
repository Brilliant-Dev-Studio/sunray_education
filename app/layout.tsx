import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SmoothScroll from "./SmoothScroll";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sunray Myanmar | Education Group",
  description: "Shaping bright futures through quality education",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
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
