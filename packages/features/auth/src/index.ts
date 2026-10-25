export type { AppSessionUser } from "./server/auth";
export {
  mapOidcProfile,
  oidcProfileSchema,
  parseEmailVerified,
  parsePhoneVerified,
  parseRoles,
} from "./server/oidc-profile";

// Presentation (shared login UI, framework-agnostic of which app renders it)
export * from "./presentation";
