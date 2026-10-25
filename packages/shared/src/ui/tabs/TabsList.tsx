"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib";

import { TabsProvider } from "./TabsContext";

import { tabsListVariants } from "./tabsVariants";

import type { TabsListProps } from "./Tabs.types";

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & TabsListProps
>(
  (
    {
      className,

      variant = "default",

      children,

      ...props
    },
    ref,
  ) => {
    return (
      <TabsProvider variant={variant ?? "default"}>
        <TabsPrimitive.List
          ref={ref}
          className={cn(tabsListVariants({ variant }), className)}
          {...props}
        >
          {children}
        </TabsPrimitive.List>
      </TabsProvider>
    );
  },
);

TabsList.displayName = TabsPrimitive.List.displayName;
