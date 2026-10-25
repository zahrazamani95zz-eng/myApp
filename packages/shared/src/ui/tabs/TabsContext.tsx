"use client";

import { createContext, useContext } from "react";

export type TabsVariant = "default" | "underline" | "pills";

interface TabsContextValue {
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function TabsProvider({
  variant,
  children,
}: {
  variant: TabsVariant;

  children: React.ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ variant }}>{children}</TabsContext.Provider>
  );
}

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used within TabsList");
  }

  return context;
}
