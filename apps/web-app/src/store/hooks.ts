import { createStoreHooks } from "@super-app/store";

import type { AppDispatch, RootState } from "./store";

export const { useAppDispatch, useAppSelector } = createStoreHooks<
  RootState,
  AppDispatch
>();
