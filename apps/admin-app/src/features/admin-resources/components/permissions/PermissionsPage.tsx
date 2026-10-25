"use client";

import { useMemo } from "react";
import { Badge, Card } from "@super-app/shared/ui";
import { useGetPermissionsCatalogQuery } from "../../../../store/api/adminResourcesApi";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  PageTitle,
  LoadingBox,
  ErrorBox,
} from "../shared/AdminResourcePrimitives";

export function PermissionsPage() {
  const q = useGetPermissionsCatalogQuery();
  const groups = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const p of q.data?.permissions ?? []) {
      const g = p.split(".")[0] ?? "other";
      (out[g] ??= []).push(p);
    }
    return out;
  }, [q.data]);
  return (
    <section className="space-y-5">
      <PageTitle
        title="مجوزها"
        description="کاتالوگ مجوزهای قابل استفاده در نقش‌ها و دسترسی‌ها."
      />
      {q.isLoading ? (
        <LoadingBox />
      ) : q.isError ? (
        <ErrorBox
          message={getApiErrorMessage(q.error, "دریافت مجوزها ناموفق بود.")}
          retry={() => void q.refetch()}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(groups).map(([g, ps]) => (
            <Card key={g} className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold">{g}</h3>
                <Badge>{ps.length.toLocaleString("fa-IR")}</Badge>
              </div>
              <div className="space-y-2">
                {ps.map((p) => (
                  <div
                    key={p}
                    dir="ltr"
                    className="rounded-lg bg-surface px-3 py-2 text-xs text-text-secondary"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
