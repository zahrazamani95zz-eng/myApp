export const dialogAnimation = {
  overlay: [
    "data-[state=open]:animate-dialog-overlay-in",
    "data-[state=closed]:animate-dialog-overlay-out",
  ],

  content: [
    "data-[state=open]:animate-dialog-content-in",
    "data-[state=closed]:animate-dialog-content-out",
  ],
} as const;
