interface BreadcrumbItem {
  label: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="مسیر صفحه"
      className="hidden items-center gap-2 text-[11px] text-text-muted sm:flex"
    >
      {items.map((item, index) => (
        <span
          key={`${item.label}-${index}`}
          className="flex items-center gap-2"
        >
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          <span
            className={
              index === items.length - 1
                ? "font-medium text-text-secondary"
                : undefined
            }
          >
            {item.label}
          </span>
        </span>
      ))}
    </nav>
  );
}
