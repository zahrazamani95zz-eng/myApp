const stats = [
  { label: "گزارش‌های امروز", value: "۲۴", trend: "+۱۲٪" },
  { label: "کاربران فعال", value: "۱۲٬۸۴۰", trend: "+۸.۶٪" },
  { label: "وضعیت سرویس", value: "پایدار", trend: "99.98%" },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-[20px] border border-border/80 bg-card p-5 shadow-[0_8px_28px_rgba(18,43,35,0.055)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(18,43,35,0.08)]"
        >
          <p className="text-sm text-text-secondary">{stat.label}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <strong className="text-2xl font-semibold tracking-tight">
              {stat.value}
            </strong>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {stat.trend}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
