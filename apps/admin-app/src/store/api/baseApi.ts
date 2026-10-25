import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_DOCUMENT_API_URL ?? "http://172.16.0.252:5001",
  }),
  tagTypes: ["Documents"],
  endpoints: () => ({}),
});
