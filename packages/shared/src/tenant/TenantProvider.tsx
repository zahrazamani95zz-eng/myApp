"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { defaultTheme, type ThemeConfig } from "@super-app/shared/theme";

export interface TenantConfig {
  id: string;
  name: string;
  slug: string;

  apps: string[];

  theme: ThemeConfig;

  logo?: string;
}

interface TenantContextType {
  tenant: TenantConfig | null;
  setTenant: (tenant: TenantConfig) => void;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const slug = window.location.pathname.split("/")[1] || "default";

    const mockTenant: TenantConfig = {
      id: "1",

      name: "شرکت اصلی",

      slug,

      apps: ["chat", "banking", "ai"],

      theme: defaultTheme,
    };

    setTenant(mockTenant);

    setIsLoading(false);
  }, []);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        setTenant,
        isLoading,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }

  return context;
}
