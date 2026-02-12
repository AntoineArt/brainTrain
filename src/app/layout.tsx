import type { Metadata, Viewport } from "next";
import { Lexend, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/components/providers/PlayerProvider";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { BottomNav } from "@/components/layout/BottomNav";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BrainTrain — Entraîne ton cerveau",
  description:
    "Mini-jeux pour entraîner ton cerveau : calcul mental, mémoire, logique, culture générale et plus encore.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${lexend.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <SettingsProvider>
          <PlayerProvider>
            <div className="min-h-dvh flex flex-col max-w-3xl mx-auto relative">
              <main className="flex-1 pb-14">{children}</main>
              <BottomNav />
            </div>
          </PlayerProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
