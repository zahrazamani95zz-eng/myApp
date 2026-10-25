"use client";

import { useCallback, type ReactNode } from "react";
import { useGetMeQuery } from "../../store/api/usersApi";

const SUPERADMIN_ROLE = "SuperAdmin";

export type PermissionRequirement = string | string[];

export function usePermissions() {
  const query = useGetMeQuery();
  const isSuperAdmin = query.data?.roles.includes(SUPERADMIN_ROLE) ?? false;
  const permissions = query.data?.permissions ?? [];

  const hasPermission = useCallback(
    (permission: string) => isSuperAdmin || permissions.includes(permission),
    [isSuperAdmin, permissions],
  );

  const hasAnyPermission = useCallback(
    (required: string[]) =>
      isSuperAdmin || required.some((p) => permissions.includes(p)),
    [isSuperAdmin, permissions],
  );

  const hasAllPermissions = useCallback(
    (required: string[]) =>
      isSuperAdmin || required.every((p) => permissions.includes(p)),
    [isSuperAdmin, permissions],
  );

  return {
    ...query,
    permissions,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}

export function PermissionGate({
  permission,
  fallback = null,
  children,
}: {
  permission: PermissionRequirement;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { hasPermission, hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) return fallback;

  const allowed = Array.isArray(permission)
    ? hasAnyPermission(permission)
    : hasPermission(permission);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
