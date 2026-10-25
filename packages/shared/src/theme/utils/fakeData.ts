import { AuthData, TenantConfig } from "../types";

export const fakeTenant: TenantConfig = {
  id: "bank-keshavarzi",
  name: "بانک کشاورزی",
  apps: ["chat", "banking", "ai"],
  theme: {
    defaultMode: "light",
    modes: {
      light: {
        primary: "#315f52",
        secondary: "#3fa77a",

        background: "#f3f6f4",
        surface: "#f3f6f4",
        card: "#ffffff",

        text: "#17231f",
        textSecondary: "#52645d",
        textMuted: "#82938b",

        border: "#dce6e1",

        success: "#269b70",
        warning: "#d79a2b",
        danger: "#d45563",
        info: "#4b8790",

        overlay: "rgba(26, 40, 70, .18)",
      },
      dark: {
        primary: "#70b69a",
        secondary: "#3db889",

        background: "#0b1211",
        surface: "#111b19",
        card: "#16241f",

        text: "#eef7f2",
        textSecondary: "#b8cbc2",
        textMuted: "#81968d",

        border: "#283d36",

        success: "#58c99b",
        warning: "#e6b45e",
        danger: "#ef7884",
        info: "#70b69a",

        overlay: "rgba(0,0,0,.42)",
      },
    },
  },
};

export const fakeUser: AuthData = {
  user: {
    id: "u-100",
    name: "Ali",
  },
  tenant: fakeTenant,
  roles: ["CUSTOMER"],
  permissions: [
    "CHAT_VIEW",
    "CHAT_SEND",
    "BANKING_VIEW",
    "BANKING_TRANSFER",
    "AI_USE",
  ],
};
