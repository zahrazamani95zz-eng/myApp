import type { EnhancedStore } from "@reduxjs/toolkit";

export type AppStore<State = unknown> = EnhancedStore<State>;

export type RootState<State = unknown> = State;

export type AppDispatch<Store extends EnhancedStore = EnhancedStore> =
  Store["dispatch"];
