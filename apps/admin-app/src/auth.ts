import { createSsoAuth } from "@super-app/features-auth/server";

export const { handlers, signIn, signOut, auth, unstable_update } =
  createSsoAuth();
