import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "@super-app/features-auth/csrf";

function readCsrfCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

export interface AdminUser {
  id: string;
  displayName: string;
  userName: string | null;
  loginName: string | null;
  phoneNumber: string | null;
  email: string | null;
  tenantId: string;
  tenantSlug: string | null;
  isActive: boolean;
  phoneNumberConfirmed: boolean;
  emailConfirmed?: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  accessFailedCount?: number;
  createdAtUtc: string;
  updatedAtUtc?: string;
  lastLoginAtUtc: string | null;
  roles: string[];
}

export interface UsersListResponse {
  items: AdminUser[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export type UsersSortBy = "displayname" | "phone" | "created";
export type SortDirection = "asc" | "desc";

export interface GetUsersQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: UsersSortBy;
  sortDir?: SortDirection;
}

export interface CreateUserRequest {
  displayName: string;
  password: string;
  phoneNumber: string;
  tenantId: string;
  email?: string | null;
  isActive?: boolean;
  phoneNumberConfirmed?: boolean;
  roles?: string[] | null;
  userName?: string | null;
}

export interface UpdateUserRequest {
  displayName: string;
  email?: string | null;
  isActive?: boolean;
  phoneNumberConfirmed?: boolean;
}

export interface UpdateUserRolesRequest {
  roles: string[];
}

export interface PermissionsResponse {
  permissions: string[];
}

export interface MeResponse {
  id: string;
  displayName: string;
  phoneNumber: string | null;
  email: string | null;
  tenantId: string;
  tenantSlug: string | null;
  tenantName: string | null;
  roles: string[];
  permissions: string[];
}

const revokeSessionsPath = (id: string) => `/users/${id}/revoke-sessions`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api/admin",
  prepareHeaders: (headers, { type }) => {
    if (type === "mutation") {
      const csrfToken = readCsrfCookie();
      if (csrfToken) headers.set(CSRF_HEADER_NAME, csrfToken);
    }
    return headers;
  },
});

const baseQueryWithAuthRedirect: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && typeof window !== "undefined") {
    if (process.env.NODE_ENV === "development") {
      console.log("55");
    } else {
      window.location.assign("/login");
    }
  }
  return result;
};

export const ssoAdminApi = createApi({
  reducerPath: "ssoAdminApi",
  baseQuery: baseQueryWithAuthRedirect,
  tagTypes: [
    "Users",
    "User",
    "Tenants",
    "Tenant",
    "Clients",
    "Client",
    "Dashboard",
    "Roles",
    "Role",
    "Permissions",
    "Scopes",
    "Authorizations",
    "Tokens",
    "AuditLogs",
    "System",
    "Menus",
    "Menu",
  ],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListResponse, GetUsersQuery>({
      query: ({ page, pageSize, search, sortBy, sortDir }) => ({
        url: "/users",
        params: {
          page,
          pageSize,
          ...(search ? { search } : {}),
          ...(sortBy ? { sortBy } : {}),
          ...(sortDir ? { sortDir } : {}),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((user) => ({
                type: "User" as const,
                id: user.id,
              })),
              { type: "Users" as const, id: "LIST" },
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),

    getUserById: builder.query<AdminUser, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    createUser: builder.mutation<AdminUser, CreateUserRequest>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation<
      AdminUser,
      { id: string; body: UpdateUserRequest }
    >({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    updateUserRoles: builder.mutation<
      AdminUser,
      { id: string; body: UpdateUserRolesRequest }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}/roles`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    lockUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}/lock`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    unlockUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}/unlock`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    revokeUserSessions: builder.mutation<void, string>({
      query: (id) => ({ url: revokeSessionsPath(id), method: "POST" }),
      invalidatesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    getPermissions: builder.query<PermissionsResponse, void>({
      query: () => "/permissions",
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => "/me",
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserRolesMutation,
  useLockUserMutation,
  useUnlockUserMutation,
  useRevokeUserSessionsMutation,
  useGetPermissionsQuery,
  useGetMeQuery,
} = ssoAdminApi;
