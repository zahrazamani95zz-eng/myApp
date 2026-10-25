import { z } from "zod";

export const oidcProfileSchema = z.object({
  sub: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  email_verified: z.union([z.boolean(), z.string()]).optional(),
  phone_number: z.string().optional(),
  phone_number_verified: z.union([z.boolean(), z.string()]).optional(),
  preferred_username: z.string().optional(),
  role: z.union([z.string(), z.array(z.string())]).optional(),
  tenant_id: z.string().optional(),
  tenant: z.string().optional(),
  tenant_name: z.string().optional(),
});

export type OidcProfile = z.infer<typeof oidcProfileSchema>;

export function parseEmailVerified(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
}

export function parsePhoneVerified(value: unknown): boolean {
  return parseEmailVerified(value);
}

export function parseRoles(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.filter((role): role is string => typeof role === "string");
  }
  return [];
}

export function mapOidcProfile(profile: OidcProfile) {
  return {
    id: profile.sub,
    name: profile.name ?? profile.preferred_username ?? profile.sub,
    email: profile.email ?? undefined,
    emailVerified: parseEmailVerified(profile.email_verified),
    phoneNumber: profile.phone_number ?? null,
    phoneNumberVerified: parsePhoneVerified(profile.phone_number_verified),
    preferredUsername: profile.preferred_username ?? null,
    roles: parseRoles(profile.role),
    tenantId: profile.tenant_id ?? null,
    tenantSlug: profile.tenant ?? null,
    tenantName: profile.tenant_name ?? null,
  };
}
