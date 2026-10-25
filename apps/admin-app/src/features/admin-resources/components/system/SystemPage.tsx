"use client";

import { CheckCircle2 } from "lucide-react";
import { Card } from "@super-app/shared/ui";
import { useGetSystemInfoQuery } from "../../../../store/api/adminResourcesApi";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  PageTitle,
  LoadingBox,
  ErrorBox,
} from "../shared/AdminResourcePrimitives";

export function SystemPage() {
  const q = useGetSystemInfoQuery();
  return (
    <section className="space-y-5">
      <PageTitle
        title="سیستم"
        description="وضعیت سرویس و اطلاعات غیرحساس محیط اجرا."
      />
      {q.isLoading ? (
        <LoadingBox />
      ) : q.isError ? (
        <ErrorBox
          message={getApiErrorMessage(
            q.error,
            "دریافت اطلاعات سیستم ناموفق بود.",
          )}
          retry={() => void q.refetch()}
        />
      ) : q.data ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Info title="محیط" value={q.data.environmentName} />
          <Info title="برنامه" value={q.data.applicationName} />
          <Info title="نسخه" value={q.data.version} />
          <Info
            title="زمان سرور"
            value={new Date(q.data.serverTimeUtc).toLocaleString("fa-IR")}
          />
          <Info title="Issuer" value={q.data.issuer} dir="ltr" />
          <Card className="p-5 md:col-span-2">
            <h3 className="mb-3 font-bold">Health</h3>
            <div className="space-y-2">
              {Object.entries(q.data.health).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between border-b border-border/70 py-2 text-sm"
                >
                  <span>{k}</span>
                  <span className="flex items-center gap-2 font-mono text-xs">
                    <CheckCircle2 size={14} className="text-success" />
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
function Info({
  title,
  value,
  dir,
}: {
  title: string;
  value: string;
  dir?: "ltr";
}) {
  return (
    <Card className="p-5">
      <p className="text-xs text-text-secondary">{title}</p>
      <p className="mt-2 break-all text-sm font-medium" dir={dir}>
        {value}
      </p>
    </Card>
  );
}
