import { AuthSessionProvider } from "@super-app/features-auth/client";
import {
  PersianDatePickerProvider,
  ToastProvider,
  TooltipProvider,
} from "@super-app/shared/ui";
import { ThemeProvider } from "@super-app/shared/theme";
import { TenantProvider } from "@super-app/shared/tenant";
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
          <AuthSessionProvider>
            <TenantProvider>
              <ThemeProvider>
                <PersianDatePickerProvider>
                  <ToastProvider>{children}</ToastProvider>
                </PersianDatePickerProvider>
              </ThemeProvider>
            </TenantProvider>
          </AuthSessionProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
