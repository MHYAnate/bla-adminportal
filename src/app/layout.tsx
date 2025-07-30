import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";
import TopLoader from "@/components/top-loader";
import QueryProvider from "@/providers/tanstack";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth";
import { ErrorBoundary } from "@/components/error-boundary";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dmsans",
});

export const metadata: Metadata = {
  title: "Buy local admin",
  description: "An agricultural driven e-commerce application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSans.variable}`}>
      <body className={`font-manrope antialiased`}>
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <TopLoader />
              <Toaster richColors expand={false} />
              {children}
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}