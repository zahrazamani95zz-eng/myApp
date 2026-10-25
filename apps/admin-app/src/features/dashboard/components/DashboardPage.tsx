"use client";

import {
  RefreshCw,
  Users,
  UserCheck,
  LockKeyhole,
  Shield,
  AppWindow,
  CircleDot,
  KeyRound,
  Key,
  Activity,
} from "lucide-react";
import { Button, Card, Spinner } from "@super-app/shared/ui";
import {
  useGetDashboardQuery,
  type DashboardResponse,
} from "../../../store/api/dashboardApi";
import { getApiErrorMessage } from "@/lib/api-error";

const cards = [
  ["usersTotal", "کاربران", Users, "primary"],
  ["usersActive", "فعال", UserCheck, "success"],
  ["usersLocked", "قفل‌شده", LockKeyhole, "warning"],
  ["roles", "نقش‌ها", Shield, "neutral"],
  ["clients", "کلاینت‌ها", AppWindow, "neutral"],
  ["scopes", "اسکوپ‌ها", CircleDot, "neutral"],
  ["authorizations", "Authorizationها", KeyRound, "neutral"],
  ["tokens", "توکن‌ها", Key, "neutral"],
  ["loginSucceededLast7Days", "ورود موفق (۷ روز)", Activity, "success"],
  ["loginFailedLast7Days", "ورود ناموفق (۷ روز)", Activity, "warning"],
] as const;

export function DashboardPage() {
  const q = useGetDashboardQuery();
  if (q.isLoading)
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-text-secondary">
        <Spinner size="sm" />
        در حال دریافت داشبورد...
      </div>
    );
  if (q.isError)
    return (
      <div className="rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
        <p className="text-sm text-danger">
          {getApiErrorMessage(q.error, "دریافت داشبورد با خطا مواجه شد.")}
        </p>
        <Button className="mt-4" variant="outline" onClick={() => q.refetch()}>
          <RefreshCw size={16} /> تلاش دوباره
        </Button>
      </div>
    );
  const data = q.data as DashboardResponse | undefined;
  return (
    <section className="space-y-6">
      <div className="border-b border-border/70 pb-4">
        <h2 className="text-2xl font-bold tracking-tight">داشبورد</h2>
        <p className="mt-1 text-sm text-text-secondary">
          نمای کلی از وضعیت کاربران، OAuth و رویدادهای امنیتی سامانه.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([key, title, Icon, tone]) => (
          <Stat
            key={key}
            title={title}
            value={Number(data?.[key] ?? 0)}
            Icon={Icon}
            tone={tone}
          />
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-border/70 px-5 py-4">
          <h3 className="font-bold">آخرین رویدادهای امنیتی</h3>
          <p className="mt-1 text-xs text-text-secondary">
            آخرین فعالیت‌های ثبت‌شده توسط سامانه
          </p>
        </div>
        <div className="divide-y divide-border/70">
          {data?.recentAuditEvents?.length ? (
            data.recentAuditEvents.map((e) => (
              <div
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-medium">{e.eventType}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {e.normalizedEmail ??
                      e.userId ??
                      e.clientId ??
                      "رویداد سیستمی"}
                  </p>
                </div>
                <time className="text-xs text-text-secondary">
                  {new Date(e.occurredAtUtc).toLocaleString("fa-IR")}
                </time>
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-center text-sm text-text-secondary">
              رویداد امنیتی جدیدی ثبت نشده است.
            </p>
          )}
        </div>
      </Card>
    </section>
  );
}
function Stat({
  title,
  value,
  Icon,
  tone,
}: {
  title: string;
  value: number;
  Icon: typeof Users;
  tone: string;
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary bg-primary/10"
      : tone === "success"
        ? "text-success bg-success/10"
        : tone === "warning"
          ? "text-warning bg-warning/10"
          : "text-text-secondary bg-surface";
  return (
    <Card className="group overflow-hidden p-5 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <strong className="mt-3 block text-3xl font-bold tabular-nums">
            {value.toLocaleString("fa-IR")}
          </strong>
        </div>
        <span
          className={`grid h-11 w-11 place-items-center rounded-2xl ${toneClass}`}
        >
          <Icon size={20} />
        </span>
      </div>
      <div className="mt-4 h-1 w-12 rounded-full bg-border">
        <div className={`h-full w-8 rounded-full ${toneClass.split(" ")[1]}`} />
      </div>
    </Card>
  );
}
