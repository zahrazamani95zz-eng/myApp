"use server";

import { redirect } from "next/navigation";
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
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_APP_URL,
    idTokenHint: token?.idToken,
  });

  await signOut({ redirect: false });
  redirect(endSessionUrl);
}
