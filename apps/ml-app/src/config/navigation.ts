export type MlMenuId =
  | "overview"
  | "models"
  | "datasets"
  | "evaluations"
  | "reports"
  | "assistant";

export interface MlNavigationItem {
  id: MlMenuId;
  title: string;
  description: string;
}

export const mlNavigation: MlNavigationItem[] = [
  {
    id: "overview",
    title: "داشبورد ML",
    description: "نمای کلی سرویس‌های هوش مصنوعی",
  },
  // { id: "models", title: "مدل‌ها", description: "مدیریت مدل‌های فعال و نسخه‌ها" },
  // { id: "datasets", title: "دیتاست‌ها", description: "مجموعه‌داده‌های آموزش و ارزیابی" },
  // { id: "evaluations", title: "ارزیابی مدل", description: "کیفیت، دقت و مقایسه مدل‌ها" },
  // { id: "reports", title: "گزارش‌های ML", description: "گزارش مصرف و عملکرد مدل‌ها" },
  {
    id: "assistant",
    title: "گفت‌وگو با دستیار",
    description: "گفت‌وگو با دستیار هوشمند",
  },
];

export const mlStats = [
  { label: "مدل‌های فعال", value: "۱۲", trend: "+۸.۴٪" },
  { label: "درخواست‌های امروز", value: "۱۸٬۴۲۰", trend: "+۱۲.۷٪" },
  { label: "میانگین دقت", value: "۹۴.۸٪", trend: "+۲.۱٪" },
];

export const mlReports = [
  {
    id: "ML-2048",
    title: "گزارش عملکرد مدل مکالمه",
    status: "تکمیل شده",
    date: "۱۴۰۵/۰۶/۱۸",
    value: "۹۶.۴٪",
  },
  {
    id: "ML-2047",
    title: "ارزیابی مدل طبقه‌بندی",
    status: "تکمیل شده",
    date: "۱۴۰۵/۰۶/۱۷",
    value: "۹۳.۸٪",
  },
  {
    id: "ML-2046",
    title: "تحلیل مصرف API مدل",
    status: "در حال پردازش",
    date: "۱۴۰۵/۰۶/۱۷",
    value: "۱۸٬۴۲۰",
  },
  {
    id: "ML-2045",
    title: "گزارش دیتاست آموزش",
    status: "تکمیل شده",
    date: "۱۴۰۵/۰۶/۱۶",
    value: "۱.۲M",
  },
];
