"use client";

import {
  Activity,
  BarChart3,
  Boxes,
  ChevronLeft,
  Database,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { mlNavigation, type MlMenuId } from "../config/navigation";

export function Sidebar({
  collapsed,
  activeMenu,
  onToggle,
  onMenuChange,
}: {
  collapsed: boolean;
  activeMenu: MlMenuId;
  onToggle: () => void;
  onMenuChange: (id: MlMenuId) => void;
}) {
  const icons = {
    overview: BarChart3,
    models: Boxes,
    datasets: Database,
    evaluations: Sparkles,
    reports: Activity,
    assistant: MessageCircle,
  } as const;

  return (
    <aside
      className={`flex h-screen flex-col border-l border-border/80 bg-surface/92 py-3 shadow-[0_10px_36px_rgba(18,43,35,0.06)] backdrop-blur transition-[width] duration-300 ${collapsed ? "w-[82px] px-3" : "w-[288px] px-4"}`}
    >
      <div
        className={`flex items-center border-b border-border pb-4 ${collapsed ? "justify-center" : "gap-3 px-2"}`}
      >
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-[0_8px_20px_rgba(83,125,87,0.22)]">
          <Activity size={21} strokeWidth={2.1} />
          <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <strong className="block truncate text-sm font-bold">
              سامانه ML
            </strong>
            <span className="mt-1 block text-[9px] font-medium tracking-[0.18em] text-text-muted">
              SUPER APP ML
            </span>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="py-5">
          <div className="rounded-[16px] border border-border/80 bg-background/70 p-3 shadow-sm">
            <span className="text-[10px] text-text-muted">محیط فعال</span>
            <div className="mt-1 flex items-center justify-between">
              <strong className="text-sm">هوش مصنوعی</strong>
              <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                ML
              </span>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="py-5">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-border bg-card text-sm font-bold text-primary">
            ML
          </div>
        </div>
      )}

      {!collapsed && (
        <div className="mb-2 px-2 text-[11px] font-semibold text-text-muted">
          منوی هوش مصنوعی
        </div>
      )}
      <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain px-0.5 py-1 [scrollbar-width:thin]">
        {mlNavigation.map((item) => {
          const active = activeMenu === item.id;
          const Icon = icons[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onMenuChange(item.id)}
              title={collapsed ? item.title : undefined}
              className={`group relative flex w-full items-center rounded-[15px] text-right text-sm transition-all duration-200 ${collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"} ${active ? "bg-primary/9 font-semibold text-primary shadow-[0_6px_18px_color-mix(in_srgb,var(--primary)_8%,transparent)]" : "text-text-secondary hover:bg-background hover:text-text"}`}
            >
              {active && (
                <span className="absolute right-0 h-6 w-1 rounded-l-full bg-primary" />
              )}
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${active ? "bg-primary text-white" : "bg-card group-hover:bg-surface"}`}
              >
                <Icon size={18} />
              </span>
              {!collapsed && <span className="truncate">{item.title}</span>}
              {!collapsed && active && (
                <ChevronLeft className="mr-auto text-primary/60" size={15} />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-[16px] border border-border/80 bg-background/70 p-3 shadow-sm">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success/10">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-text">
                وضعیت سرویس ML
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-text-muted">
                مدل‌ها و API پایدار هستند
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
          title={collapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-border/80 bg-card text-text-secondary transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          {collapsed ? (
            <PanelRightOpen size={17} />
          ) : (
            <PanelRightClose size={17} />
          )}
          {!collapsed && (
            <span className="text-xs font-medium">جمع کردن منو</span>
          )}
        </button>
      </div>
    </aside>
  );
}
