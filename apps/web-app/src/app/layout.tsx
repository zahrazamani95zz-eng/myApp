"use client";

import { TooltipProvider } from "@super-app/shared/ui";
import { AppProviders } from "../providers/appProviders";
import { ServiceWorkerRegistrar } from "./ServiceWorkerRegistrar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <TooltipProvider>
          <AppProviders>
            <ServiceWorkerRegistrar />
            {children}
          </AppProviders>
        </TooltipProvider>
      </body>
    </html>
  );
}
