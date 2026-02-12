import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/components/providers/PlayerProvider";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { BottomNav } from "@/components/layout/BottomNav";

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
    <html lang="fr">
      <body className="antialiased bg-background text-foreground">
        <SettingsProvider>
          <PlayerProvider>
            <div className="min-h-dvh flex flex-col max-w-3xl mx-auto">
              <main className="flex-1 pb-20">{children}</main>
              <BottomNav />
            </div>
          </PlayerProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
