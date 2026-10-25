import { configureStore } from "@reduxjs/toolkit";

// Auth session state is owned by NextAuth (see `@super-app/features-auth/client`'s
// `useSession()` / `AuthSessionProvider`), not Redux — there is no `auth`
// slice here. Add reducers for non-auth app state as needed.
export const store = configureStore({
  reducer: {},
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
