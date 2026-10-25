import { ssoAdminApi } from "./usersApi";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
export interface RoleDto {
  id: string;
  name: string;
  permissions: string[];
}
export interface PermissionCatalog {
  permissions: string[];
}
export interface ScopeDto {
  id: string;
  name: string;
  displayName?: string | null;
  description?: string | null;
  resources: string[];
}
export interface MenuItemDto {
  id: string;
  key: string;
  parentId: string | null;
  route: string;
  titleFa: string;
  titleEn: string;
  iconKey: string | null;
  permissionKey: string | null;
  sortOrder: number;
  isActive: boolean;
  isSystem: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}
export interface CreateMenuItemRequest {
  key: string;
  parentId?: string | null;
  route: string;
  titleFa: string;
  titleEn: string;
  iconKey?: string | null;
  permissionKey?: string | null;
  sortOrder: number;
  isActive: boolean;
}
export type UpdateMenuItemRequest = Omit<CreateMenuItemRequest, "key"> & {
  id: string;
};
export interface AuthorizationListItem {
  id: string;
  subject?: string | null;
  clientId?: string | null;
  status?: string | null;
  type?: string | null;
  creationDate?: string | null;
  scopes: string[];
}
export interface TokenListItem {
  id: string;
  subject?: string | null;
  clientId?: string | null;
  status?: string | null;
  type?: string | null;
  creationDate?: string | null;
  expirationDate?: string | null;
  authorizationId?: string | null;
}
export interface AuditLogListItem {
  id: string;
  eventType: string;
  userId?: string | null;
  normalizedEmail?: string | null;
  clientId?: string | null;
  occurredAtUtc: string;
  details?: string | null;
}
export interface AuditLogDetail extends AuditLogListItem {
  ipAddressHash?: string | null;
  userAgentHash?: string | null;
  correlationId?: string | null;
}
export interface SystemInfo {
  environmentName: string;
  issuer: string;
  applicationName: string;
  version: string;
  serverTimeUtc: string;
  health: Record<string, string>;
}

const listQuery = (path: string) => ({
  query: ({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }) => ({
    url: path,
    params: { page, pageSize, ...(search ? { search } : {}) },
  }),
});

export const adminResourcesApi = ssoAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<
      PagedResult<RoleDto>,
      { page: number; pageSize: number; search?: string }
    >({
      query: listQuery("/roles").query,
      providesTags: [{ type: "Roles", id: "LIST" }],
    }),
    getRole: builder.query<RoleDto, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation<
      RoleDto,
      { name: string; permissions: string[] }
    >({
      query: (body) => ({ url: "/roles", method: "POST", body }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }, "Dashboard"],
    }),
    updateRole: builder.mutation<
      RoleDto,
      { id: string; name: string; permissions: string[] }
    >({
      query: ({ id, ...body }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Role", id },
        { type: "Roles", id: "LIST" },
      ],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({ url: `/roles/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }, "Dashboard"],
    }),
    getPermissionsCatalog: builder.query<PermissionCatalog, void>({
      query: () => "/permissions",
      providesTags: ["Permissions"],
    }),

    getScopes: builder.query<
      PagedResult<ScopeDto>,
      { page: number; pageSize: number; search?: string }
    >({
      query: listQuery("/scopes").query,
      providesTags: [{ type: "Scopes", id: "LIST" }],
    }),
    createScope: builder.mutation<
      ScopeDto,
      {
        name: string;
        displayName?: string;
        description?: string;
        resources?: string[];
      }
    >({
      query: ({ resources = [], ...body }) => ({
        url: "/scopes",
        method: "POST",
        body: { ...body, resources },
      }),
      invalidatesTags: [{ type: "Scopes", id: "LIST" }, "Dashboard"],
    }),
    deleteScope: builder.mutation<void, string>({
      query: (id) => ({ url: `/scopes/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Scopes", id: "LIST" }, "Dashboard"],
    }),
    updateScope: builder.mutation<
      ScopeDto,
      {
        id: string;
        name: string;
        displayName?: string;
        description?: string;
        resources?: string[];
      }
    >({
      query: ({ id, resources = [], ...body }) => ({
        url: `/scopes/${id}`,
        method: "PUT",
        body: { ...body, resources },
      }),
      invalidatesTags: (_r, _e, { id }) => {
        console.log("🚀 ~ id:", id);
        return [{ type: "Scopes", id: "LIST" }, "Dashboard"];
      },
    }),

    getMenus: builder.query<
      PagedResult<MenuItemDto>,
      {
        page: number;
        pageSize: number;
        search?: string;
        sortBy?: string;
        sortDir?: "asc" | "desc";
      }
    >({
      query: ({ page, pageSize, search, sortBy, sortDir }) => ({
        url: "/menus",
        params: {
          page,
          pageSize,
          ...(search ? { search } : {}),
          ...(sortBy ? { sortBy } : {}),
          ...(sortDir ? { sortDir } : {}),
        },
      }),
      providesTags: [{ type: "Menus", id: "LIST" }],
    }),
    getMenu: builder.query<MenuItemDto, string>({
      query: (id) => `/menus/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Menu", id }],
    }),
    createMenu: builder.mutation<MenuItemDto, CreateMenuItemRequest>({
      query: (body) => ({ url: "/menus", method: "POST", body }),
      invalidatesTags: [{ type: "Menus", id: "LIST" }],
    }),
    updateMenu: builder.mutation<MenuItemDto, UpdateMenuItemRequest>({
      query: ({ id, ...body }) => ({
        url: `/menus/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Menu", id },
        { type: "Menus", id: "LIST" },
      ],
    }),
    deleteMenu: builder.mutation<void, string>({
      query: (id) => ({ url: `/menus/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Menus", id: "LIST" }],
    }),

    getAuthorizations: builder.query<
      PagedResult<AuthorizationListItem>,
      { page: number; pageSize: number; search?: string }
    >({
      query: listQuery("/authorizations").query,
      providesTags: [{ type: "Authorizations", id: "LIST" }],
    }),
    revokeAuthorization: builder.mutation<void, string>({
      query: (id) => ({ url: `/authorizations/${id}/revoke`, method: "POST" }),
      invalidatesTags: [
        { type: "Authorizations", id: "LIST" },
        "Tokens",
        "Dashboard",
      ],
    }),

    getTokens: builder.query<
      PagedResult<TokenListItem>,
      { page: number; pageSize: number; search?: string }
    >({
      query: listQuery("/tokens").query,
      providesTags: [{ type: "Tokens", id: "LIST" }],
    }),
    revokeToken: builder.mutation<void, string>({
      query: (id) => ({ url: `/tokens/${id}/revoke`, method: "POST" }),
      invalidatesTags: [{ type: "Tokens", id: "LIST" }, "Dashboard"],
    }),

    getAuditLogs: builder.query<
      PagedResult<AuditLogListItem>,
      { page: number; pageSize: number; search?: string; eventType?: string }
    >({
      query: ({ page, pageSize, search, eventType }) => ({
        url: "/audit-logs",
        params: {
          page,
          pageSize,
          ...(search ? { search } : {}),
          ...(eventType ? { eventType } : {}),
        },
      }),
      providesTags: [{ type: "AuditLogs", id: "LIST" }],
    }),
    getAuditLog: builder.query<AuditLogDetail, string>({
      query: (id) => `/audit-logs/${id}`,
    }),
    getSystemInfo: builder.query<SystemInfo, void>({
      query: () => "/system",
      providesTags: ["System"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsCatalogQuery,
  useGetScopesQuery,
  useCreateScopeMutation,
  useDeleteScopeMutation,
  useUpdateScopeMutation,
  useGetMenusQuery,
  useGetMenuQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useGetAuthorizationsQuery,
  useRevokeAuthorizationMutation,
  useGetTokensQuery,
  useRevokeTokenMutation,
  useGetAuditLogsQuery,
  useGetAuditLogQuery,
  useGetSystemInfoQuery,
} = adminResourcesApi;
