import { createStoreHooks } from "@super-app/store";
import type { AppDispatch, RootState } from "./store";

const storeHooks = createStoreHooks<RootState, AppDispatch>();

export const useAppDispatch = storeHooks.useAppDispatch;
export const useAppSelector = storeHooks.useAppSelector;
