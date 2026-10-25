"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@super-app/shared/ui";
import { useTheme } from "@super-app/shared/theme";
import { PageTitle } from "../shared/AdminResourcePrimitives";

export function SettingsPage() {
  return <SettingsPanel />;
}

function SettingsPanel() {
  const { mode, toggleTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  console.log("🚀 ~ SettingsPanel ~ sidebarCollapsed:", sidebarCollapsed);
  useEffect(() => {
    setSidebarCollapsed(
      window.localStorage.getItem("admin-sidebar-collapsed") === "true",
    );
  }, []);
  function setSidebar(next: boolean) {
    setSidebarCollapsed(next);
    if (typeof window !== "undefined")
      window.localStorage.setItem("admin-sidebar-collapsed", String(next));
  }
  return (
    <section className="space-y-5">
      <PageTitle
        title="تنظیمات"
        description="تنظیمات ظاهری و رفتاری پنل مدیریت."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-bold">تم رابط کاربری</h3>
          <p className="mt-1 text-sm text-text-secondary">
            حالت فعلی: {mode === "dark" ? "تیره" : "روشن"}
          </p>
          <Button className="mt-4" variant="outline" onClick={toggleTheme}>
            {mode === "dark" ? "فعال‌کردن تم روشن" : "فعال‌کردن تم تیره"}
          </Button>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold">سایدبار</h3>
          <p className="mt-1 text-sm text-text-secondary">
            حالت نمایش منوی مدیریت را مشخص کنید.
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              // variant={sidebarCollapsed ? "default" : "outline"}
              onClick={() => setSidebar(true)}
            >
              جمع‌شده
            </Button>
            <Button
              //   variant={!sidebarCollapsed ? "default" : "outline"}
              onClick={() => setSidebar(false)}
            >
              باز
            </Button>
          </div>
        </Card>
        <Card className="p-5 md:col-span-2">
          <h3 className="font-bold">زبان و جهت</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              فارسی
            </div>
            <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              RTL
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
