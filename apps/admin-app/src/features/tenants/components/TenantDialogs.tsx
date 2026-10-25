"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Spinner,
  toast,
} from "@super-app/shared/ui";
import {
  useCreateTenantMutation,
  useGetTenantByIdQuery,
  useUpdateTenantMutation,
  type Tenant,
} from "../../../store/api/tenantsApi";
import { getApiErrorMessage } from "@/lib/api-error";

export function TenantFormDialog({
  open,
  onOpenChange,
  tenantId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tenantId?: string | null;
}) {
  const edit = Boolean(tenantId);
  const query = useGetTenantByIdQuery(tenantId!, { skip: !tenantId });
  const [createTenant, { isLoading: creating }] = useCreateTenantMutation();
  const [updateTenant, { isLoading: updating }] = useUpdateTenantMutation();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const loading = creating || updating;
  useEffect(() => {
    if (query.data) {
      setName(query.data.name);
      setSlug(query.data.slug);
      setIsActive(query.data.isActive);
    } else if (!edit) {
      setName("");
      setSlug("");
      setIsActive(true);
    }
  }, [query.data, edit]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || (!edit && !slug.trim())) return;
    try {
      if (edit)
        await updateTenant({
          id: tenantId!,
          body: { name: name.trim(), isActive },
        }).unwrap();
      else
        await createTenant({
          name: name.trim(),
          slug: slug.trim(),
          isActive,
        }).unwrap();
      toast.success({
        title: edit ? "سازمان بروزرسانی شد" : "سازمان ایجاد شد",
      });
      onOpenChange(false);
    } catch (e) {
      toast.error({
        title: "خطا",
        description: getApiErrorMessage(e, "عملیات سازمان انجام نشد."),
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent
      //size="md"
      >
        <DialogHeader>
          <DialogTitle>{edit ? "ویرایش سازمان" : "افزودن سازمان"}</DialogTitle>
          <DialogDescription>
            {edit
              ? "نام و وضعیت سازمان قابل تغییر است؛ slug ثابت می‌ماند."
              : "نام و slug یکتا را وارد کنید."}
          </DialogDescription>
        </DialogHeader>
        {edit && query.isLoading ? (
          <div className="py-10 text-center">
            <Spinner
            // size="sm"
            />
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 pt-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">نام سازمان</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                className="mt-1"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Slug</span>
              <Input
                dir="ltr"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                maxLength={64}
                required
                disabled={edit}
                className="mt-1"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />{" "}
              سازمان فعال باشد
            </label>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                انصراف
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Spinner size="sm" />
                ) : edit ? (
                  "ذخیره تغییرات"
                ) : (
                  "ایجاد سازمان"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function TenantDetailsDialog({
  tenant,
  onOpenChange,
}: {
  tenant: Tenant | null;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={!!tenant} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>جزئیات سازمان</DialogTitle>
        </DialogHeader>
        {tenant ? (
          <div className="rounded-xl border border-border bg-surface px-4">
            <Row l="نام">{tenant.name}</Row>
            <Row l="Slug">
              <span dir="ltr">{tenant.slug}</span>
            </Row>
            <Row l="وضعیت">{tenant.isActive ? "فعال" : "غیرفعال"}</Row>
            <Row l="شناسه">
              <span dir="ltr" className="text-xs">
                {tenant.id}
              </span>
            </Row>
            <Row l="ایجاد">{fmt(tenant.createdAtUtc)}</Row>
            <Row l="آخرین بروزرسانی">{fmt(tenant.updatedAtUtc)}</Row>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
function Row({ l, children }: { l: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 py-2.5 text-sm last:border-0">
      <span className="text-text-muted">{l}</span>
      <span className="min-w-0 truncate font-medium">{children}</span>
    </div>
  );
}
function fmt(v: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(v));
}
