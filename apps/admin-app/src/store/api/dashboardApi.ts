import { ssoAdminApi } from "./usersApi";
export interface AuditEvent {
  id: string;
  eventType: string;
  userId?: string | null;
  normalizedEmail?: string | null;
  clientId?: string | null;
  occurredAtUtc: string;
  details?: string | null;
}
export interface DashboardResponse {
  usersTotal: number;
  usersActive: number;
  usersLocked: number;
  roles: number;
  clients: number;
  scopes: number;
  authorizations: number;
  tokens: number;
  loginSucceededLast7Days: number;
  loginFailedLast7Days: number;
  recentAuditEvents: AuditEvent[];
}
export const dashboardApi = ssoAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => "/dashboard",
      providesTags: [{ type: "Dashboard", id: "ROOT" }],
    }),
  }),
  overrideExisting: false,
});
export const { useGetDashboardQuery } = dashboardApi;
