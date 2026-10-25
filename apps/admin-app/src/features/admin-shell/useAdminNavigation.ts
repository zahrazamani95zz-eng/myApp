"use client";

import { useMemo } from "react";
import {
  staticProductNavigation,
  type AdminNavigationItem,
  type AdminProduct,
} from "../../config/navigation";
import {
  useGetMenusQuery,
  type MenuItemDto,
} from "../../store/api/adminResourcesApi";

export const NAVIGATION_MENUS_QUERY = { page: 1, pageSize: 100 } as const;

export function buildMenuTree(menus: MenuItemDto[]): AdminNavigationItem[] {
  const byId = new Map(menus.map((menu) => [menu.id, menu]));

  const isVisible = (menu: MenuItemDto): boolean => {
    const seen = new Set<string>();
    let current: MenuItemDto | undefined = menu;
    while (current) {
      if (!current.isActive || seen.has(current.id)) return false;
      seen.add(current.id);
      current = current.parentId ? byId.get(current.parentId) : undefined;
    }
    return true;
  };

  const sorted = menus
    .filter(isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.key.localeCompare(b.key));

  const nodes = new Map<string, AdminNavigationItem>(
    sorted.map((menu) => [
      menu.id,
      {
        id: menu.key,
        title: menu.titleFa,
        href: menu.route,
        iconKey: menu.iconKey,
      },
    ]),
  );

  const roots: AdminNavigationItem[] = [];
  for (const menu of sorted) {
    const node = nodes.get(menu.id)!;
    const parent = menu.parentId ? nodes.get(menu.parentId) : undefined;
    if (parent) (parent.children ??= []).push(node);
    else roots.push(node);
  }
  return roots;
}

export function useAdminNavigation(product: AdminProduct) {
  const query = useGetMenusQuery(NAVIGATION_MENUS_QUERY, {
    skip: product !== "tak",
  });

  const items = useMemo<AdminNavigationItem[]>(() => {
    if (product !== "tak") return staticProductNavigation[product] ?? [];
    return buildMenuTree(query.data?.items ?? []);
  }, [product, query.data]);

  const remote = product === "tak";
  return {
    items,
    isLoading: remote && query.isLoading,
    isError: remote && query.isError,
    error: remote ? query.error : undefined,
    refetch: () => void query.refetch(),
  };
}
