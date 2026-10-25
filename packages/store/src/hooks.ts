import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";

export const createStoreHooks = <
  State,
  AppDispatch extends Dispatch<UnknownAction>,
>() => {
  const useAppDispatch = () => useDispatch<AppDispatch>();

  const useAppSelector: TypedUseSelectorHook<State> = useSelector;

  return {
    useAppDispatch,
    useAppSelector,
  };
};
