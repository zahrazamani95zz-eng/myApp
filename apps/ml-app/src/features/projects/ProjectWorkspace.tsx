"use client";

import { useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";
import { WorkspaceShell } from "@super-app/shared/ui";
import { AccountMenu } from "@super-app/features-auth/presentation";
import { mlNavigation, type MlMenuId } from "../../config/navigation";
import { Sidebar } from "../../components/Sidebar";
import { StatsCards } from "../../components/StatsCards";
import { ReportsTable } from "../../components/ReportsTable";
import { MlAssistantChat } from "../assistant-chat/AssistantChatEntry";
import { logoutEverywhere } from "../../app/actions/session-actions";

export function ProjectWorkspace({
  initialMenu = "overview",
  chatId,
}: {
  initialMenu?: MlMenuId;
  chatId?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MlMenuId>(initialMenu);

  useEffect(() => {
    const saved = window.localStorage.getItem("ml-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  const active =
    mlNavigation.find((item) => item.id === activeMenu) ?? mlNavigation[0];

  function toggleSidebar() {
    setCollapsed((value) => {
      const next = !value;
      window.localStorage.setItem("ml-sidebar-collapsed", String(next));
      return next;
    });
  }

  function changeMenu(id: MlMenuId) {
    setActiveMenu(id);
    setMobileOpen(false);
  }

  return (
    <WorkspaceShell
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      onCloseMobile={() => setMobileOpen(false)}
      sidebar={
        <Sidebar
          collapsed={collapsed}
          activeMenu={activeMenu}
          onToggle={toggleSidebar}
          onMenuChange={changeMenu}
        />
      }
      header={
        <header className="relative z-30 flex min-h-[72px] flex-none items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="باز کردن منوی ML"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-text-secondary transition hover:border-primary/30 hover:text-primary lg:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <div className="hidden items-center gap-2 text-[11px] text-text-muted sm:flex">
                <span>سامانه ML</span>
                <span>/</span>
                <span>هوش مصنوعی</span>
              </div>
              <h1 className="truncate text-base font-bold sm:mt-1 sm:text-lg">
                {active.title}
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-full border border-border bg-surface px-3 py-2 text-[11px] font-medium text-text-secondary xl:inline-flex">
              محیط ML
            </span>
            <button
              type="button"
              aria-label="اعلان‌ها"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-text-secondary transition hover:border-primary/30 hover:text-text"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-surface" />
            </button>
            <AccountMenu onSignOut={logoutEverywhere} />
          </div>
        </header>
      }
    >
      {activeMenu === "assistant" ? (
        <div className="flex h-full min-h-0 flex-1 overflow-hidden">
          <MlAssistantChat chatId={chatId} />
        </div>
      ) : (
        <div className="mx-auto w-full min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <span className="text-xs font-medium tracking-widest text-primary">
              MACHINE LEARNING
            </span>
            <h2 className="mt-1 text-lg font-semibold">مرکز عملیات ML</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {active.description}
            </p>
          </section>
          <StatsCards />
          <ReportsTable />
        </div>
      )}
    </WorkspaceShell>
  );
}
