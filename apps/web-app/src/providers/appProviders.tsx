"use client";

import { AuthSessionProvider } from "@super-app/features-auth/client";
import { PersianDatePickerProvider } from "@super-app/shared/ui";

import { QueryProvider } from "./queryProvider";
import { TenantProvider } from "./tenantProvider";
import { ThemeProvider } from "./themeProvider";
import { ToastProvider } from "./toastProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <QueryProvider>
        <TenantProvider>
          <ThemeProvider>
            <PersianDatePickerProvider>
              <ToastProvider>{children}</ToastProvider>
            </PersianDatePickerProvider>
          </ThemeProvider>
        </TenantProvider>
      </QueryProvider>
    </AuthSessionProvider>
  );
}
