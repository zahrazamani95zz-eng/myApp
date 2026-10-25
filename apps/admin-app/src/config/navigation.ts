export type AdminProduct = "tak" | "ml";

export interface AdminNavigationItem {
  id: string;
  title: string;
  href: string;
  iconKey?: string | null;
  children?: AdminNavigationItem[];
}

export interface AdminProductOption {
  id: AdminProduct;
  title: string;
  description: string;
}

export const productOptions: AdminProductOption[] = [
  {
    id: "tak",
    title: "تاک",
    description: "مدیریت و گزارش‌های سامانه تاک",
  },
  {
    id: "ml",
    title: "ML",
    description: "مدیریت سرویس‌های هوش مصنوعی و مدل‌ها",
  },
];

export const staticProductNavigation: Partial<
  Record<AdminProduct, AdminNavigationItem[]>
> = {
  ml: [
    { id: "overview", title: "داشبورد ML", href: "/admin/ml" },
    { id: "models", title: "مدل‌ها", href: "/admin/ml/models" },
    { id: "datasets", title: "دیتاست‌ها", href: "/admin/ml/datasets" },
    { id: "evaluations", title: "ارزیابی مدل", href: "/admin/ml/evaluations" },
    { id: "reports", title: "گزارش‌های ML", href: "/admin/ml/reports" },
  ],
};

export interface FlatNavigationItem {
  item: AdminNavigationItem;
  depth: number;
}

export function flattenNavigation(
  items: AdminNavigationItem[],
  depth = 0,
): FlatNavigationItem[] {
  return items.flatMap((item) => [
    { item, depth },
    ...flattenNavigation(item.children ?? [], depth + 1),
  ]);
}

export function findActiveNavigationItem(
  items: AdminNavigationItem[],
  pathname: string,
): AdminNavigationItem | undefined {
  const flat = flattenNavigation(items)
    .map(({ item }) => item)
    .filter((item) => item.href);
  const exact = flat.find((item) => item.href === pathname);
  if (exact) return exact;
  return flat
    .filter(
      (item) => item.href !== "/admin" && pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export interface ReportRow {
  id: string;
  title: string;
  product: AdminProduct;
  status: "تکمیل شده" | "در حال پردازش";
  date: string;
  value: string;
}

export const reportRows: ReportRow[] = [
  {
    id: "R-1042",
    title: "گزارش عملکرد سرویس",
    product: "ml",
    status: "تکمیل شده",
    date: "۱۴۰۵/۰۶/۱۶",
    value: "۹۸.۴٪",
  },
  {
    id: "R-1041",
    title: "گزارش کاربران فعال",
    product: "tak",
    status: "تکمیل شده",
    date: "۱۴۰۵/۰۶/۱۵",
    value: "۱۲٬۸۴۰",
  },
  {
    id: "R-1040",
    title: "گزارش ارزیابی مدل",
    product: "ml",
    status: "در حال پردازش",
    date: "۱۴۰۵/۰۶/۱۴",
    value: "۸۷.۲٪",
  },
  {
    id: "R-1039",
    title: "گزارش مصرف محتوا",
    product: "tak",
    status: "تکمیل شده",
    date: "۱۴۰۵/۰۶/۱۳",
    value: "۴۶٬۲۱۰",
  },
];
