"use client";

import { useState } from "react";
import { Check, ChevronDown, UserPlus, X } from "lucide-react";
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
  useForm,
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
} from "@super-app/shared/ui";

import {
  useCreateUserMutation,
  type CreateUserRequest,
} from "../../../store/api/usersApi";
import { useGetRolesQuery } from "../../../store/api/adminResourcesApi";
import { useGetTenantsQuery } from "../../../store/api/tenantsApi";
import { usePermissions } from "../../../components/admin/permissions";

interface CreateUserFormValues {
  displayName: string;
  phoneNumber: string;
  password: string;
  tenantId: string;
  userName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  phoneNumberConfirmed: boolean;
}

import { getApiErrorMessage } from "@/lib/api-error";

const defaultValues: CreateUserFormValues = {
  displayName: "",
  phoneNumber: "",
  password: "",
  tenantId: "",
  userName: "",
  email: "",
  roles: [],
  isActive: true,
  phoneNumberConfirmed: true,
};

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const IRAN_MOBILE_PATTERN = /^09\d{9}$/;

export function CreateUserDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateUserDialogProps) {
  const { hasPermission } = usePermissions();
  const canAssignRoles = hasPermission("users.roles");
  const form = useForm<CreateUserFormValues>({ defaultValues });
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [roleSearch, setRoleSearch] = useState("");
  const tenantsQuery = useGetTenantsQuery(
    { page: 1, pageSize: 100 },
    { skip: !open },
  );
  const rolesQuery = useGetRolesQuery(
    { page: 1, pageSize: 100 },
    { skip: !open },
  );
  const availableRoles = rolesQuery.data?.items ?? [];
  const normalizedRoleSearch = roleSearch.trim().toLocaleLowerCase("fa");
  const filteredRoles = availableRoles.filter((role) =>
    role.name.toLocaleLowerCase("fa").includes(normalizedRoleSearch),
  );

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

  async function onSubmit(values: CreateUserFormValues) {
    const body: CreateUserRequest = {
      displayName: values.displayName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      password: values.password,
      tenantId: values.tenantId.trim(),
      isActive: values.isActive,
      phoneNumberConfirmed: values.phoneNumberConfirmed,
      userName: values.userName.trim() || undefined,
      email: values.email.trim() || undefined,
      roles: canAssignRoles ? values.roles : undefined,
    };

    try {
      const created = await createUser(body).unwrap();
      toast.success({
        title: "کاربر ایجاد شد",
        description: `«${created.displayName}» با موفقیت ایجاد شد.`,
      });
      form.reset(defaultValues);
      setRoleSearch("");
      setRolePickerOpen(false);
      onCreated?.();
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error({
        title: "خطا در ایجاد کاربر",
        description: getApiErrorMessage(error, "ایجاد کاربر انجام نشد."),
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !isLoading && onOpenChange(value)}
    >
      <DialogContent
        // size="md"
        closeOnOutsideClick={!isLoading}
        closeOnEscape={!isLoading}
      >
        <DialogHeader>
          <DialogTitle>افزودن کاربر</DialogTitle>
          <DialogDescription>
            موبایل باید یک شماره معتبر ایرانی باشد و رمز عبور حداقل ۱۲ کاراکتر
            باشد.
          </DialogDescription>
        </DialogHeader>

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
                      placeholder="علی رضایی"
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
              name="phoneNumber"
              rules={{
                required: "موبایل الزامی است.",
                pattern: {
                  value: IRAN_MOBILE_PATTERN,
                  message: "موبایل باید به فرم 09xxxxxxxxx باشد.",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>موبایل *</FormLabel>
                  <FormControl>
                    <Input
                      dir="ltr"
                      placeholder="09121234567"
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
              name="password"
              rules={{
                required: "رمز عبور الزامی است.",
                minLength: {
                  value: 12,
                  message: "رمز عبور باید حداقل ۱۲ کاراکتر باشد.",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز عبور *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      dir="ltr"
                      placeholder="حداقل ۱۲ کاراکتر"
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
              name="tenantId"
              rules={{ required: "سازمان الزامی است." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سازمان *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-text outline-none focus:ring-2 focus:ring-primary mt-1"
                      value={field.value as string}
                      onChange={field.onChange}
                      disabled={tenantsQuery.isLoading}
                    >
                      <option value="">
                        {tenantsQuery.isLoading
                          ? "در حال دریافت سازمان‌ها..."
                          : "انتخاب سازمان…"}
                      </option>
                      {tenantsQuery.data?.items.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name} ({tenant.slug})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {tenantsQuery.isError ? (
                    <p className="text-xs text-danger">
                      دریافت سازمان‌ها انجام نشد.
                    </p>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام کاربری (اختیاری)</FormLabel>
                  <FormControl>
                    <Input
                      dir="ltr"
                      placeholder="بدون آن، از فرم موبایل استفاده می‌شود"
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
                  <FormLabel>ایمیل (اختیاری)</FormLabel>
                  <FormControl>
                    <Input
                      dir="ltr"
                      placeholder="ali@example.com"
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

          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => {
              const selectedRoles = Array.isArray(field.value)
                ? field.value
                : [];

              return (
                <FormItem className="sm:col-span-2">
                  <FormLabel>نقش‌ها (اختیاری)</FormLabel>
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
                            disabled={rolesQuery.isLoading}
                          >
                            <span
                              className={
                                selectedRoles.length
                                  ? "text-text"
                                  : "text-text-muted"
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
                          //size="md"
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
                                          selected ? "opacity-100" : "opacity-0"
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
                        می‌توانید چند نقش را انتخاب کنید. نقش‌ها از فهرست مدیریت
                        نقش‌ها خوانده می‌شوند.
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex flex-wrap items-center gap-5 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                {...form.register("isActive")}
              />
              حساب فعال باشد
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                {...form.register("phoneNumberConfirmed")}
              />
              موبایل تأییدشده باشد
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={isLoading} translate="no">
              <span className="inline-flex items-center gap-2">
                <span className={isLoading ? "" : "hidden"}>
                  <Spinner
                  //size="sm"
                  />
                </span>

                <span className={isLoading ? "hidden" : ""}>
                  <UserPlus size={17} />
                </span>

                <span>{isLoading ? "در حال ایجاد..." : "ایجاد کاربر"}</span>
              </span>
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
