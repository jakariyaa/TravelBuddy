import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travner",
  description: "Find your perfect travel companion",
};

import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import StoreProvider from "./StoreProvider";
import AuthGuard from "./components/AuthGuard";
import SplashScreen from "./components/SplashScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <AuthGuard>
              <SplashScreen />
              {children}
            </AuthGuard>
            <Toaster position="top-center" richColors />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
