import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NeuralDoc AI | Advanced Multimodal Q&A",
  description: "High-end AI document questioning system using multimodal intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <main className="flex-1 flex flex-col relative overflow-hidden">
              {/* Animated Background Mesh */}
              <div className="fixed inset-0 -z-10 bg-background">
                <div className="absolute inset-0 neural-gradient" />
                <div className="absolute top-1/4 -left-1/4 w-[100vw] h-[100vh] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-1/4 w-[100vw] h-[100vh] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
              </div>
              {children}
            </main>
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
