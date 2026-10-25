import { ssoAdminApi } from "./usersApi";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}
export interface TenantsListResponse {
  items: Tenant[];
  totalCount: number;
  page: number;
  pageSize: number;
}
export interface GetTenantsQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
export interface CreateTenantRequest {
  name: string;
  slug: string;
  isActive?: boolean;
}
export interface UpdateTenantRequest {
  name: string;
  isActive?: boolean;
}

export const tenantsApi = ssoAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query<TenantsListResponse, GetTenantsQuery>({
      query: ({ page, pageSize, search, sortBy, sortDir }) => ({
        url: "/tenants",
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
              ...result.items.map((t) => ({
                type: "Tenant" as const,
                id: t.id,
              })),
              { type: "Tenants" as const, id: "LIST" },
            ]
          : [{ type: "Tenants" as const, id: "LIST" }],
    }),
    getTenantById: builder.query<Tenant, string>({
      query: (id) => `/tenants/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Tenant", id }],
    }),
    createTenant: builder.mutation<Tenant, CreateTenantRequest>({
      query: (body) => ({ url: "/tenants", method: "POST", body }),
      invalidatesTags: [{ type: "Tenants", id: "LIST" }],
    }),
    updateTenant: builder.mutation<
      Tenant,
      { id: string; body: UpdateTenantRequest }
    >({
      query: ({ id, body }) => ({ url: `/tenants/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Tenant", id },
        { type: "Tenants", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTenantsQuery,
  useGetTenantByIdQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
} = tenantsApi;
