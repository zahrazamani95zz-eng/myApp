import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./api/baseApi";
import { ssoAdminApi } from "./api/usersApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [ssoAdminApi.reducerPath]: ssoAdminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, ssoAdminApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
