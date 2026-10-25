import type { ReactNode } from "react";

interface LoginFormProps {
  /**
   * A Next.js Server Action that starts the SSO login flow, e.g.
   *
   *   async function login() {
   *     "use server";
   *     await signIn("openiddict", { redirectTo: callbackUrl });
   *   }
   *
   * `signIn`/`signOut`/`auth` are bound per-app (each app has its own
   * OIDC_CLIENT_ID / cookies), so the action itself is created in each
   * app's own `login/page.tsx` from that app's `@/auth`. This component
   * only owns the (shared) presentation.
   */
  action: () => Promise<void>;
  label?: ReactNode;
  className?: string;
}

export function LoginForm({
  action,
  label = "Sign in with SSO",
  className,
}: LoginFormProps) {
  return (
    <form action={action}>
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
