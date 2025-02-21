import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "jos-animation/dist/jos.css";
import "swiper/css";
import "swiper/css/navigation";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import Preloader from "./(root)/_components/animation/preloader";
import PageTransition from "./(root)/_components/animation/page-transition";

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Global Skill Academy",
  description: "Empowering Indonesia's Golden Generation 2045",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable}`}>
        <body className="font-inter">
          <Suspense fallback={<Preloader />}>
            <PageTransition>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
                {children}
                <Toaster />
              </ThemeProvider>
            </PageTransition>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
