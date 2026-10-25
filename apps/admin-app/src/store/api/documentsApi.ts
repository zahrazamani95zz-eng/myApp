import { baseApi } from "./baseApi";

export interface DocumentItem {
  id: number;
  title: string;
  created_at: string;
}

export interface DocumentsResponse {
  page_index: number;
  page_size: number;
  total: number;
  created_at: string;
  filters: {
    search?: string;
    from_date?: string;
    to_date?: string;
  };
  files: DocumentItem[];
}

export interface DocumentsQuery {
  pageIndex: number;
  pageSize: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface UploadResponse {
  success: boolean;
  filename?: string;
  pages?: number;
  chars?: number;
  output?: string;
  qdrant?: boolean;
  message?: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
  id: number;
  filename?: string;
}

export interface BatchDeleteResult {
  id: number;
  filename?: string;
  success: boolean;
  error?: string;
}

export interface BatchDeleteResponse {
  total: number;
  successful: number;
  failed: number;
  results: BatchDeleteResult[];
}

/** A serializable result used for one-shot browser downloads. */
export interface DownloadResponse {
  objectUrl: string;
}

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<DocumentsResponse, DocumentsQuery>({
      query: ({ pageIndex, pageSize, search, fromDate, toDate }) => ({
        url: "/qdrant/files",
        params: {
          page_index: pageIndex,
          page_size: pageSize,
          ...(search ? { search } : {}),
          ...(fromDate ? { from_date: fromDate } : {}),
          ...(toDate ? { to_date: toDate } : {}),
        },
      }),
      providesTags: ["Documents"],
    }),
    uploadDocument: builder.mutation<UploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return { url: "/upload/file/", method: "POST", body: formData };
      },
      invalidatesTags: ["Documents"],
    }),
    deleteDocument: builder.mutation<DeleteResponse, number>({
      query: (id) => ({ url: `/qdrant/files/${id}`, method: "DELETE" }),
      invalidatesTags: ["Documents"],
    }),
    deleteDocuments: builder.mutation<BatchDeleteResponse, number[]>({
      query: (ids) => ({
        url: `/qdrant/files/batch?${ids.map((id) => `ids=${encodeURIComponent(id)}`).join("&")}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),
    // Do not put Blob/File/ArrayBuffer into RTK Query state: they are non-serializable.
    // The endpoint creates a temporary object URL and stores only that string.
    downloadDocument: builder.mutation<DownloadResponse, number>({
      async queryFn(id, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: `/qdrant/files/download/${id}`,
          responseHandler: async (response) => {
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          },
        });

        if (result.error) {
          return { error: result.error };
        }

        return { data: { objectUrl: result.data as string } };
      },
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useDeleteDocumentsMutation,
  useDownloadDocumentMutation,
} = documentsApi;
