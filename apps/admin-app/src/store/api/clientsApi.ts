import { ssoAdminApi } from "./usersApi";

export interface OAuthClient {
  id: string;
  clientId: string;
  displayName: string | null;
  clientType: string | null;
  consentType: string | null;
  redirectUris?: string[];
  postLogoutRedirectUris?: string[];
  permissions?: string[];
  requirements?: string[];
  hasClientSecret?: boolean;
}
export interface ClientsListResponse {
  items: OAuthClient[];
  totalCount: number;
  page: number;
  pageSize: number;
}
export interface GetClientsQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
export interface CreateClientRequest {
  clientId: string;
  clientSecret: string;
  clientType?: string;
  consentType?: string;
  displayName?: string | null;
  permissions?: string[];
  postLogoutRedirectUris?: string[];
  redirectUris?: string[];
  requirements?: string[];
}
export interface UpdateClientRequest {
  consentType?: string | null;
  displayName?: string | null;
  permissions?: string[];
  postLogoutRedirectUris?: string[];
  redirectUris?: string[];
  requirements?: string[];
}
export interface RotateClientSecretResponse {
  clientId: string;
  clientSecret: string;
}

export const clientsApi = ssoAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<ClientsListResponse, GetClientsQuery>({
      query: ({ page, pageSize, search, sortBy, sortDir }) => ({
        url: "/clients",
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
              ...result.items.map((c) => ({
                type: "Client" as const,
                id: c.id,
              })),
              { type: "Clients" as const, id: "LIST" },
            ]
          : [{ type: "Clients" as const, id: "LIST" }],
    }),
    getClientById: builder.query<OAuthClient, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Client", id }],
    }),
    createClient: builder.mutation<OAuthClient, CreateClientRequest>({
      query: (body) => ({ url: "/clients", method: "POST", body }),
      invalidatesTags: [{ type: "Clients", id: "LIST" }],
    }),
    updateClient: builder.mutation<
      OAuthClient,
      { id: string; body: UpdateClientRequest }
    >({
      query: ({ id, body }) => ({ url: `/clients/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Client", id },
        { type: "Clients", id: "LIST" },
      ],
    }),
    deleteClient: builder.mutation<void, string>({
      query: (id) => ({ url: `/clients/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Clients", id: "LIST" }],
    }),
    rotateClientSecret: builder.mutation<RotateClientSecretResponse, string>({
      query: (id) => ({ url: `/clients/${id}/rotate-secret`, method: "POST" }),
    }),
    revokeClient: builder.mutation<void, string>({
      query: (id) => ({ url: `/clients/${id}/revoke`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Client", id }],
    }),
  }),
  overrideExisting: false,
});
export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useRotateClientSecretMutation,
  useRevokeClientMutation,
} = clientsApi;
