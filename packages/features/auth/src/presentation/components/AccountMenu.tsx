"use client";

import { useSession } from "next-auth/react";

interface AccountMenuProps {
  /**
   * The app's own `logoutEverywhere` server action (see
   * `src/app/actions/session-actions.ts` in each app). It is app-specific
   * because it is bound to that app's own `auth`/`signOut` instance and
   * cookie jar — this component only owns the (shared) presentation.
   */
  onSignOut: () => Promise<void>;
  className?: string;
}

/**
 * Minimal, framework-shared "who am I / sign out" widget. Reads the
 * session via NextAuth's `useSession()` (same source of truth used
 * everywhere else — see `AuthSessionProvider`), so it always reflects the
 * real SSO session state instead of a separately-managed copy.
 *
 * Renders as a plain inline pill by default so each app can drop it
 * straight into its own header/topbar next to other header controls.
 * Pass `className` to restyle or reposition it (e.g. to float it) if an
 * app doesn't have a header shell yet.
 */
export function AccountMenu({ onSignOut, className }: AccountMenuProps) {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  const { user } = session;
  const displayName =
    user.name ?? user.email ?? user.preferredUsername ?? user.id;

  return (
    <div
      className={
        className ??
        "flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-2 text-xs shadow-sm"
      }
    >
      <span className="max-w-[140px] truncate font-medium">{displayName}</span>
      <form action={onSignOut}>
        <button
          type="submit"
          className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary transition hover:bg-primary/20"
        >
          خروج
        </button>
      </form>
    </div>
  );
}
