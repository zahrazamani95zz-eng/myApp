"use client";

import type { ReactNode } from "react";

export interface WorkspaceShellProps {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
  sidebarWidth?: number;
  collapsedSidebarWidth?: number;
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function WorkspaceShell({
  children,
  sidebar,
  header,
  sidebarWidth = 288,
  collapsedSidebarWidth = 82,
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
}: WorkspaceShellProps) {
  const width = collapsed ? collapsedSidebarWidth : sidebarWidth;

  return (
    <main
      className="workspace-shell h-dvh overflow-hidden bg-background text-text"
      dir="rtl"
    >
      <div className="relative h-full min-h-0 w-full overflow-hidden">
        <div
          className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity lg:hidden ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={onCloseMobile}
          aria-hidden="true"
        />

        <aside
          className={`fixed inset-y-0 right-0 z-50 transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          {sidebar}
        </aside>

        <section
          className="workspace-main-column flex min-h-0 min-w-0 flex-col overflow-hidden"
          dir="rtl"
          style={{ right: `${width}px` }}
        >
          {header}
          <div
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
            style={{ scrollbarGutter: "stable" }}
          >
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
