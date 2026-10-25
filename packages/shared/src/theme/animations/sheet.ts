export const sheetAnimation = {
  overlay: [
    "data-[state=open]:animate-sheet-overlay-in",
    "data-[state=closed]:animate-sheet-overlay-out",
  ],

  content: {
    right: [
      "data-[state=open]:animate-sheet-right-in",
      "data-[state=closed]:animate-sheet-right-out",
    ],

    left: [
      "data-[state=open]:animate-sheet-left-in",
      "data-[state=closed]:animate-sheet-left-out",
    ],

    top: [
      "data-[state=open]:animate-sheet-top-in",
      "data-[state=closed]:animate-sheet-top-out",
    ],

    bottom: [
      "data-[state=open]:animate-sheet-bottom-in",
      "data-[state=closed]:animate-sheet-bottom-out",
    ],
  },
} as const;
