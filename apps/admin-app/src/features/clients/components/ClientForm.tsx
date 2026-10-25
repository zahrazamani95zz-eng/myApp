"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
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
  useCreateClientMutation,
  useGetClientByIdQuery,
  useUpdateClientMutation,
} from "../../../store/api/clientsApi";
import { getApiErrorMessage } from "@/lib/api-error";

export function ClientForm({
  open,
  onOpenChange,
  id,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string | null;
}) {
  const edit = !!id;
  const q = useGetClientByIdQuery(id!, { skip: !id });
  const [create, { isLoading: creating }] = useCreateClientMutation();
  const [update, { isLoading: updating }] = useUpdateClientMutation();
  const [clientId, setClientId] = useState("");
  const [secret, setSecret] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("confidential");
  const [consent, setConsent] = useState("implicit");
  const [redirect, setRedirect] = useState("");
  const [logout, setLogout] = useState("");
  const [permissions, setPermissions] = useState("");
  const [requirements, setRequirements] = useState("");
  const loading = creating || updating;
  useEffect(() => {
    if (q.data) {
      setClientId(q.data.clientId);
      setName(q.data.displayName ?? "");
      setType(q.data.clientType ?? "");
      setConsent(q.data.consentType ?? "");
      setRedirect((q.data.redirectUris ?? []).join("\n"));
      setLogout((q.data.postLogoutRedirectUris ?? []).join("\n"));
      setPermissions((q.data.permissions ?? []).join("\n"));
      setRequirements((q.data.requirements ?? []).join("\n"));
    }
  }, [q.data]);
  if (edit && q.data && !clientId) setClientId(q.data.clientId);
  const arr = (v: string) =>
    v
      .split(/\n|,/)
      .map((x) => x.trim())
      .filter(Boolean);
  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      if (edit)
        await update({
          id: id!,
          body: {
            displayName: name.trim() || null,
            consentType: consent || null,
            redirectUris: arr(redirect),
            postLogoutRedirectUris: arr(logout),
            permissions: arr(permissions),
            requirements: arr(requirements),
          },
        }).unwrap();
      else
        await create({
          clientId: clientId.trim(),
          clientSecret: secret,
          displayName: name.trim() || null,
          clientType: type,
          consentType: consent,
          redirectUris: arr(redirect),
          postLogoutRedirectUris: arr(logout),
          permissions: arr(permissions),
          requirements: arr(requirements),
        }).unwrap();
      toast.success({
        title: edit ? "کلاینت بروزرسانی شد" : "کلاینت ایجاد شد",
      });
      onOpenChange(false);
    } catch (e) {
      toast.error({
        title: "خطا",
        description: getApiErrorMessage(e, "عملیات کلاینت انجام نشد."),
      });
    }
  }
  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{edit ? "ویرایش کلاینت" : "افزودن کلاینت"}</DialogTitle>
          <DialogDescription>
            {edit
              ? "clientId و secret قابل تغییر مستقیم نیستند؛ برای secret از Rotate استفاده کنید."
              : "برای confidential، secret حداقل ۳۲ کاراکتر باشد."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Client ID">
            <Input
              dir="ltr"
              value={clientId}
              disabled={edit}
              onChange={(e) => setClientId(e.target.value)}
              required={!edit}
              className="mt-1"
            />
          </Field>
          {!edit && (
            <Field label="Client Secret">
              <Input
                dir="ltr"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                minLength={32}
                required
                className="mt-1"
              />
            </Field>
          )}
          <Field label="Display name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={200}
              className="mt-1"
            />
          </Field>
          <Field label="Client type">
            <Input
              dir="ltr"
              value={type}
              disabled={edit}
              onChange={(e) => setType(e.target.value)}
              className="mt-1"
            />
          </Field>
          <Field label="Consent type">
            <Input
              dir="ltr"
              value={consent}
              onChange={(e) => setConsent(e.target.value)}
              className="mt-1"
            />
          </Field>
          <Field label="Redirect URIs">
            <textarea
              className="min-h-24 w-full rounded-xl border border-border bg-background p-3 text-sm mt-1"
              dir="ltr"
              value={redirect}
              onChange={(e) => setRedirect(e.target.value)}
            />
          </Field>
          <Field label="Post logout redirect URIs">
            <textarea
              className="min-h-24 w-full rounded-xl border border-border bg-background p-3 text-sm mt-1"
              dir="ltr"
              value={logout}
              onChange={(e) => setLogout(e.target.value)}
            />
          </Field>
          <Field label="Permissions">
            <textarea
              className="min-h-24 w-full rounded-xl border border-border bg-background p-3 text-sm mt-1"
              dir="ltr"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
            />
          </Field>
          <Field label="Requirements">
            <textarea
              className="min-h-24 w-full rounded-xl border border-border bg-background p-3 text-sm mt-1"
              dir="ltr"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </Field>

          <div className="sm:col-span-2 text-xs text-text-muted">
            هر مقدار را در یک خط یا با کاما جدا کنید.
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "ذخیره"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
