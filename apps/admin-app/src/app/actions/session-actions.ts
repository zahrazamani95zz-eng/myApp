"use server";

import { redirect } from "next/navigation";
import { serverEnv } from "../../config/env";
import { signOut } from "@/auth";
import {
  buildEndSessionUrl,
  getServerAuthToken,
  revokeAccessAndRefreshTokens,
} from "@super-app/features-auth/server";
export async function logoutEverywhere() {
  const token = await getServerAuthToken();

  await revokeAccessAndRefreshTokens({
    accessToken: token?.accessToken,
    refreshToken: token?.refreshToken,
  });

  const endSessionUrl = buildEndSessionUrl({
    postLogoutRedirectUri: serverEnv.NEXT_PUBLIC_APP_URL,
    idTokenHint: token?.idToken,
  });

  await signOut({ redirect: false });
  redirect(endSessionUrl);
}
