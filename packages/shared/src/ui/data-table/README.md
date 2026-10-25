# Shared DataTable

`DataTable` is the shared TanStack Table wrapper used by the apps in this monorepo.

## Supported capabilities

- Client/server pagination
- Controlled pagination (`onPaginationChange`)
- Sorting, including server-side sorting
- Global search
- Per-column filters, including server-side filtering
- Row selection
- Column reordering with native drag & drop
- Expandable rows
- Nested content / nested `DataTable`
- RTL-friendly shared styling

## Nested chat example

The expanded content is deliberately rendered by the feature. This keeps the shared table generic and lets a feature render another table instead of forcing a specific nested-data model.

```tsx
<DataTable
  data={chats}
  columns={chatColumns}
  getRowId={(chat) => String(chat.id)}
  enableExpanding
  renderExpandedRow={(chat) => (
    <DataTable
      data={messagesByChat[chat.id] ?? []}
      columns={messageColumns}
      getRowId={(message) => String(message.id)}
      pagination
      pageSize={10}
    />
  )}
/>
```

For a large chat list, the feature should fetch messages lazily when a chat is expanded (for example `GET /chats/{id}/messages`) instead of loading every message with the chat list.

## Server-side pagination

```tsx
<DataTable
  data={items}
  columns={columns}
  pagination
  manualPagination
  pageIndex={pageIndex}
  pageSize={pageSize}
  pageCount={Math.max(1, Math.ceil(total / pageSize))}
  totalRows={total}
  onPaginationChange={({ pageIndex, pageSize }) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
  }}
/>
```

`onPaginationChange` is the preferred API. The older `onPageChange` and `onPageSizeChange` props remain available for compatibility.
