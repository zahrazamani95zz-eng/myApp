# Admin architecture review

## Current repository structure

- `apps/admin-app`: admin shell and admin-specific presentation.
- `apps/ml-app`: ML-specific application boundary.
- `apps/web-app`: end-user application.
- `packages/shared`: cross-application UI, theme, tenant, MQTT and common utilities.
- `packages/core`: domain primitives, entities, ports and authentication contracts.
- `packages/features/*`: business capabilities such as auth and chat, separated from applications.
- `packages/store`: shared Redux store helpers/types.

## Decision: shared DataTable

The reusable table belongs in `packages/shared/src/ui/data-table` because its responsibility is presentation and interaction, not report business logic.

Applications should provide:

- column definitions
- row/domain types
- cell rendering
- filtering text
- API data

The shared component owns generic table behavior:

- sorting
- client-side search
- pagination
- loading state
- empty state
- RTL-friendly alignment
- responsive horizontal scrolling

When reports become API-backed at scale, keep the same component boundary and add controlled/server-side pagination and sorting rather than moving report logic into `shared`.

## Admin responsibility

`apps/admin-app/src/features/admin-shell` owns the admin workspace state. `src/config/navigation.ts` owns the admin product/menu configuration. `src/components/admin` contains admin-specific composition components and consumes primitives from `@super-app/shared/ui`.

The product switcher is intentionally an application-level concern: choosing `تاک` or `ML` changes the navigation configuration; it should not be implemented inside the shared UI package.

## Theme

Admin now consumes the existing shared `ThemeProvider` instead of maintaining a separate theme implementation. The shared provider persists the selected mode through a configurable `storageKey`.

## Important follow-up

The repository still contains placeholder admin/ML business data and menu destinations. The architecture is ready for real feature modules, but those should be introduced under application/feature boundaries rather than adding domain logic to `shared`.

## Shared DataTable

`packages/shared/src/ui/data-table` is the single reusable table UI. Its table state/rendering is powered by `@tanstack/react-table`; product-specific screens only provide typed `ColumnDef` definitions and data. Do not add report-specific table implementations under `apps/*`.

The package and any consuming app should declare `@tanstack/react-table` as a dependency. After pulling these changes, run `pnpm install` to refresh `pnpm-lock.yaml` in the normal development environment.

## Typography and theme

`admin-app` intentionally uses the same global stylesheet contract as `web-app`: shared theme styles are imported first and Admin does not override `font-family`. This keeps typography inherited from the same application/browser stack instead of introducing an Admin-only font.

Theme mode is provided by `@super-app/shared/theme` and uses the shared default storage key. Admin does not maintain a separate theme implementation.

## Product switcher

`ProductSwitcher` is an Admin feature component, but the actual dropdown primitive comes from `@super-app/shared/ui` (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`). Product options and navigation remain Admin-owned configuration.

## Route-based Admin shell

The Admin application uses Next.js App Router routes as the source of truth for navigation. The shared Admin shell lives in `features/admin-shell/AdminWorkspace` and wraps route content through `app/admin/layout.tsx`.

Main routes include `/admin`, `/admin/users`, `/admin/roles`, `/admin/permissions`, `/admin/clients`, `/admin/scopes`, `/admin/authorizations`, `/admin/tokens`, `/admin/audit-logs`, `/admin/system`, `/admin/settings`, `/admin/tenants`, and `/admin/documents`. ML routes live under `/admin/ml/*`.

`config/navigation.ts` owns labels, permissions and canonical `href` values. Sidebar state is presentation state only; the URL is the source of truth for the active section.

The Admin BFF validates its configured backend URL, rejects suspicious path segments, and requires a matching same-origin `Origin` header for mutating browser requests.

`apps/admin-app/src/config/env.ts` validates the Admin backend URL and application origin at startup. Keep deployment-specific values in environment configuration and use `.env.example` as the template.

### کنترل دسترسی در سطح قابلیت (Permission-aware UI)

علاوه بر فیلتر منوی Sidebar، Admin یک لایه مشترک `usePermissions()` در `components/admin/permissions.tsx` دارد که مجوزهای `getMe` را در تمام صفحات قابل استفاده می‌کند. این لایه برای کنترل‌های حساس UI استفاده می‌شود؛ از جمله ایجاد/ویرایش/حذف نقش و Scope، عملیات کاربران، مدیریت Secret کلاینت و ایجاد/ویرایش سازمان.

این کنترل صرفاً UX و visibility است و Authorization واقعی همچنان باید در Backend باقی بماند؛ بنابراین درخواست مستقیم یا دستکاری UI همچنان باید با `403` توسط API رد شود. `SuperAdmin` نیز در همین لایه به‌صورت مرکزی مدیریت می‌شود تا منطق permission در Sidebar و صفحات تکرار نشود.

نمونه:

```tsx
const { hasPermission } = usePermissions();

{
  hasPermission("users.lock") ? <Button>قفل کردن</Button> : null;
}
```
