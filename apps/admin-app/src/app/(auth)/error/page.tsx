"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  // ArrowRight,
  Lock,
  RefreshCw,
  ServerCrash,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@super-app/shared/ui";

type ErrorMeta = {
  title: string;
  description: string;
  hint?: string;
  icon: typeof ShieldAlert;
  tone: "danger" | "warning" | "info";
};

const MESSAGES: Record<string, ErrorMeta> = {
  Configuration: {
    title: "مشکل در تنظیمات ورود",
    description:
      "سرویس احراز هویت به‌درستی پیکربندی نشده است. ورود در حال حاضر امکان‌پذیر نیست.",
    hint: "اگر مدیر سامانه هستید، تنظیمات OIDC و متغیرهای محیطی را بررسی کنید.",
    icon: ServerCrash,
    tone: "danger",
  },
  AccessDenied: {
    title: "دسترسی مجاز نیست",
    description: "حساب شما اجازهٔ ورود به این بخش را ندارد.",
    hint: "در صورت نیاز با مدیر سیستم برای دریافت دسترسی تماس بگیرید.",
    icon: Lock,
    tone: "warning",
  },
  Verification: {
    title: "لینک نامعتبر یا منقضی",
    description: "این لینک ورود دیگر معتبر نیست یا منقضی شده است.",
    hint: "یک‌بار دیگر از طریق صفحهٔ ورود اقدام کنید.",
    icon: AlertTriangle,
    tone: "warning",
  },
  OAuthSignin: {
    title: "خطا در شروع ورود",
    description: "امکان شروع فرآیند ورود وجود نداشت.",
    icon: ShieldAlert,
    tone: "danger",
  },
  OAuthCallback: {
    title: "خطا در بازگشت از سرویس ورود",
    description: "پاسخ سرویس احراز هویت نامعتبر بود یا ناقص دریافت شد.",
    icon: ShieldAlert,
    tone: "danger",
  },
  Default: {
    title: "خطا در ورود",
    description: "مشکلی در فرآیند ورود پیش آمد. لطفاً دوباره تلاش کنید.",
    icon: ShieldAlert,
    tone: "danger",
  },
};

const TONE_STYLES = {
  danger: {
    ring: "border-danger/20 bg-danger/5",
    iconWrap: "bg-danger/10 text-danger ring-danger/15",
    badge: "bg-danger/10 text-danger",
  },
  warning: {
    ring: "border-warning/25 bg-warning/5",
    iconWrap: "bg-warning/10 text-warning ring-warning/15",
    badge: "bg-warning/10 text-warning",
  },
  info: {
    ring: "border-info/20 bg-info/5",
    iconWrap: "bg-info/10 text-info ring-info/15",
    badge: "bg-info/10 text-info",
  },
} as const;

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("error") ?? "Default";
  const meta = MESSAGES[code] ?? MESSAGES.Default;
  const tone = TONE_STYLES[meta.tone];
  const Icon = meta.icon;
  // const isDev = process.env.NODE_ENV === "development";

  return (
    <main
      dir="rtl"
      className="relative flex min-h-dvh items-center justify-center px-4 py-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* نوار بالای کارت */}
          <div className={`border-b px-6 py-5 sm:px-8 ${tone.ring}`}>
            <div className="flex items-start gap-4">
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${tone.iconWrap}`}
              >
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5 text-right">
                <p className="text-xs font-medium text-text-muted">
                  سامانه مدیریت
                </p>
                <h1 className="text-lg font-bold tracking-tight text-text sm:text-xl">
                  {meta.title}
                </h1>
              </div>
            </div>
          </div>

          {/* بدنه */}
          <div className="space-y-5 px-6 py-6 sm:px-8">
            <p className="text-sm leading-7 text-text-secondary">
              {meta.description}
            </p>

            {meta.hint ? (
              <div className="rounded-xl border border-border bg-surface/80 px-4 py-3 text-right">
                <p className="text-xs leading-6 text-text-muted">{meta.hint}</p>
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2.5 pt-1 sm:flex-row sm:justify-start">
              <Link href="/login">
                <Button
                  variant="primary"
                  size="md"
                  className="inline-flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4 shrink-0" />
                  <span>تلاش مجدد </span>
                </Button>
              </Link>

              <Link href="/">
                <Button
                  variant="outline"
                  size="md"
                  className="inline-flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4 shrink-0" />
                  <span>بازگشت به صفحه اصلی</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-text-muted">
          اگر مشکل ادامه داشت، با تیم پشتیبانی سامانه تماس بگیرید.
        </p>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-dvh place-items-center text-sm text-text-secondary">
          در حال بارگذاری...
        </main>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
