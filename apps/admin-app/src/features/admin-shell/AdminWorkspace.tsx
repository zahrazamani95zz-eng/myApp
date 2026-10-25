"use client";

import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AccountMenu } from "@super-app/features-auth/presentation";
import { WorkspaceShell } from "@super-app/shared/ui";

import {
  findActiveNavigationItem,
  flattenNavigation,
  productOptions,
  type AdminProduct,
} from "../../config/navigation";
import { useAdminNavigation } from "./useAdminNavigation";
import { Sidebar } from "../../components/admin/Sidebar";
import { Breadcrumbs } from "../../components/admin/Breadcrumbs";
import { ThemeToggle } from "../../components/admin/ThemeToggle";
import { ProductSwitcher } from "../../components/admin/ProductSwitcher";
import { logoutEverywhere } from "../../app/actions/session-actions";

function getProductFromPathname(pathname: string): AdminProduct {
  return pathname.startsWith("/admin/ml") ? "ml" : "tak";
}

export function AdminWorkspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const product = getProductFromPathname(pathname);
  const navigation = useAdminNavigation(product);
  const activeItem = findActiveNavigationItem(navigation.items, pathname);
  const activeMenu = activeItem?.id;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("admin-sidebar-collapsed", String(next));
      return next;
    });
  }

  const selected =
    productOptions.find((item) => item.id === product) ?? productOptions[0];
  const activeTitle = activeItem?.title ?? selected.title;

  function changeProduct(next: AdminProduct) {
    router.push(next === "ml" ? "/admin/ml" : "/admin");
  }

  function changeMenu(next: string) {
    const item = flattenNavigation(navigation.items).find(
      ({ item: entry }) => entry.id === next,
    )?.item;
    if (item?.href) router.push(item.href);
  }

  return (
    <WorkspaceShell
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      onCloseMobile={() => setMobileOpen(false)}
      sidebar={
        <Sidebar
          product={product}
          items={navigation.items}
          isLoading={navigation.isLoading}
          isError={navigation.isError}
          onRetry={navigation.refetch}
          activeMenu={activeMenu}
          collapsed={collapsed}
          onToggle={toggleSidebar}
          onMenuChange={changeMenu}
        />
      }
      header={
        <header className="relative z-30 flex min-h-[72px] flex-none items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="باز کردن منوی مدیریت"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-text-secondary transition hover:border-primary/30 hover:text-primary lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <Breadcrumbs
                items={[
                  { label: "پنل مدیریت" },
                  { label: selected.title },
                  ...(activeItem &&
                  activeItem.href !== "/admin" &&
                  activeItem.href !== "/admin/ml"
                    ? [{ label: activeTitle }]
                    : []),
                ]}
              />
              <h1 className="truncate text-base font-bold sm:mt-1 sm:text-lg">
                {activeTitle}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-full border border-border bg-surface px-3 py-2 text-[11px] font-medium text-text-secondary xl:inline-flex">
              محیط مدیریت
            </span>
            <ThemeToggle />
            <button
              type="button"
              aria-label="اعلان‌ها"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-text-secondary transition hover:border-primary/30 hover:text-text"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-surface" />
            </button>
            <ProductSwitcher value={product} onChange={changeProduct} />
            <AccountMenu onSignOut={logoutEverywhere} />
          </div>
        </header>
      }
    >
      <div className="mx-auto w-full min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </WorkspaceShell>
  );
}
