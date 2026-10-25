"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  toast,
  useForm,
} from "@super-app/shared/ui";
import { skipToken } from "@reduxjs/toolkit/query/react";

import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserRolesMutation,
} from "../../../store/api/usersApi";
import { useGetRolesQuery } from "../../../store/api/adminResourcesApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { usePermissions } from "../../../components/admin/permissions";

interface EditUserFormValues {
  displayName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  phoneNumberConfirmed: boolean;
}

const defaultValues: EditUserFormValues = {
  displayName: "",
  email: "",
  roles: [],
  isActive: true,
  phoneNumberConfirmed: true,
};

interface EditUserDialogProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export function EditUserDialog({
  userId,
  onOpenChange,
  onUpdated,
}: EditUserDialogProps) {
  const open = userId !== null;
  const { hasPermission } = usePermissions();
  const canEditRoles = hasPermission("users.roles");
  const form = useForm<EditUserFormValues>({ defaultValues });
  const userQuery = useGetUserByIdQuery(userId ?? skipToken);
  const [updateUser, updateState] = useUpdateUserMutation();
  const [updateUserRoles, rolesState] = useUpdateUserRolesMutation();
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [roleSearch, setRoleSearch] = useState("");

  const rolesQuery = useGetRolesQuery(
    { page: 1, pageSize: 100 },
    { skip: !open },
  );
  const availableRoles = rolesQuery.data?.items ?? [];
  const normalizedRoleSearch = roleSearch.trim().toLocaleLowerCase("fa");
  const filteredRoles = availableRoles.filter((role) =>
    role.name.toLocaleLowerCase("fa").includes(normalizedRoleSearch),
  );

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setRoleSearch("");
      setRolePickerOpen(false);
      return;
    }

    if (userQuery.data) {
      form.reset({
        displayName: userQuery.data.displayName,
        email: userQuery.data.email ?? "",
        roles: [...userQuery.data.roles],
        isActive: userQuery.data.isActive,
        phoneNumberConfirmed: userQuery.data.phoneNumberConfirmed,
      });
    }
  }, [form, open, userQuery.data]);

  const loading = updateState.isLoading || rolesState.isLoading;

  function toggleRole(roleName: string) {
    const current = form.getValues("roles");
    form.setValue(
      "roles",
      current.includes(roleName)
        ? current.filter((role) => role !== roleName)
        : [...current, roleName],
      { shouldDirty: true },
    );
  }

  function removeRole(roleName: string) {
    form.setValue(
      "roles",
      form.getValues("roles").filter((role) => role !== roleName),
      { shouldDirty: true },
    );
  }

  async function onSubmit(values: EditUserFormValues) {
    if (!userId) return;

    try {
      await updateUser({
        id: userId,
        body: {
          displayName: values.displayName.trim(),
          email: values.email.trim() || null,
          isActive: values.isActive,
          phoneNumberConfirmed: values.phoneNumberConfirmed,
        },
      }).unwrap();

      if (canEditRoles) {
        await updateUserRoles({
          id: userId,
          body: { roles: values.roles },
        }).unwrap();
      }

      toast.success({
        title: "کاربر بروزرسانی شد",
        description: "اطلاعات و نقش‌های کاربر با موفقیت ذخیره شد.",
      });
      onUpdated?.();
      onOpenChange(false);
    } catch (error) {
      toast.error({
        title: "خطا در ذخیره تغییرات",
        description: getApiErrorMessage(error, "ذخیره تغییرات انجام نشد."),
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !loading && onOpenChange(value)}
    >
      <DialogContent
        //  size="md"
        closeOnOutsideClick={!loading}
        closeOnEscape={!loading}
      >
        <DialogHeader>
          <DialogTitle>ویرایش کاربر</DialogTitle>
          <DialogDescription>
            اطلاعات پایه، وضعیت حساب و نقش‌های کاربر را ویرایش کنید.
          </DialogDescription>
        </DialogHeader>

        {userQuery.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-text-secondary">
            <Spinner
            // size="sm"
            />{" "}
            در حال دریافت اطلاعات کاربر...
          </div>
        ) : userQuery.isError ? (
          <p className="py-8 text-center text-sm text-danger">
            {getApiErrorMessage(
              userQuery.error,
              "دریافت اطلاعات کاربر با خطا مواجه شد.",
            )}
          </p>
        ) : userQuery.data ? (
          <Form form={form} onSubmit={onSubmit} className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="displayName"
                rules={{
                  required: "نام نمایشی الزامی است.",
                  maxLength: { value: 100, message: "حداکثر ۱۰۰ کاراکتر." },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام نمایشی *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value as string}
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "ایمیل معتبر نیست.",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input
                        dir="ltr"
                        {...field}
                        value={field.value as string}
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border mt-1"
                  {...form.register("isActive")}
                />
                حساب فعال باشد
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border mt-1"
                  {...form.register("phoneNumberConfirmed")}
                />
                موبایل تأییدشده باشد
              </label>
            </div>

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => {
                const selectedRoles = Array.isArray(field.value)
                  ? field.value
                  : [];

                return (
                  <FormItem>
                    <FormLabel>نقش‌ها / سطح دسترسی</FormLabel>
                    <FormControl>
                      <div className="space-y-3 mt-1">
                        <Popover
                          open={rolePickerOpen}
                          onOpenChange={setRolePickerOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between font-normal"
                              disabled={rolesQuery.isLoading || !canEditRoles}
                            >
                              <span
                                className={
                                  selectedRoles.length
                                    ? "text-text mt-1"
                                    : "text-text-muted mt-1"
                                }
                              >
                                {rolesQuery.isLoading
                                  ? "در حال دریافت نقش‌ها..."
                                  : selectedRoles.length
                                    ? `${selectedRoles.length} نقش انتخاب شده`
                                    : "انتخاب نقش‌ها"}
                              </span>
                              <ChevronDown size={17} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            // size="md"
                            align="start"
                            className="p-2"
                          >
                            <Command shouldFilter={false}>
                              <CommandInput
                                value={roleSearch}
                                onValueChange={setRoleSearch}
                                placeholder="جست‌وجوی نقش..."
                              />
                              <CommandList>
                                {rolesQuery.isError ? (
                                  <CommandEmpty>
                                    دریافت نقش‌ها انجام نشد.
                                  </CommandEmpty>
                                ) : filteredRoles.length === 0 ? (
                                  <CommandEmpty>نقشی پیدا نشد.</CommandEmpty>
                                ) : (
                                  filteredRoles.map((role) => {
                                    const selected = selectedRoles.includes(
                                      role.name,
                                    );
                                    return (
                                      <CommandItem
                                        key={role.id}
                                        value={role.name}
                                        onSelect={() => toggleRole(role.name)}
                                        className="justify-between"
                                      >
                                        <span>{role.name}</span>
                                        <span
                                          className={
                                            selected
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }
                                        >
                                          <Check size={16} />
                                        </span>
                                      </CommandItem>
                                    );
                                  })
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {selectedRoles.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedRoles.map((role) => (
                              <Badge
                                key={role}
                                //  variant="outline"
                                className="gap-1.5"
                              >
                                <span dir="ltr">{role}</span>
                                <button
                                  type="button"
                                  aria-label={`حذف نقش ${role}`}
                                  className="rounded-full p-0.5 transition hover:bg-surface"
                                  onClick={() => removeRole(role)}
                                >
                                  <X size={13} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        ) : null}

                        <p className="text-xs text-text-muted">
                          می‌توانید چند نقش را انتخاب کنید. این فهرست از مدیریت
                          نقش‌ها خوانده می‌شود.
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

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
                  <Spinner
                  // size="sm"
                  />
                ) : (
                  "ذخیره تغییرات"
                )}
              </Button>
            </DialogFooter>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
