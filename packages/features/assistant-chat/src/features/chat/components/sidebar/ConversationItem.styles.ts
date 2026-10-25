export const conversationItemStyles = {
  root: `group flex w-full items-center gap-1 rounded-[15px] border border-transparent px-3 py-2.5 transition-all duration-200 hover:-translate-y-px hover:bg-background/70 hover:shadow-sm`,
  active: `border-primary/15 bg-primary/8 shadow-[0_5px_18px_color-mix(in_srgb,var(--primary)_8%,transparent)]`,
  content: `min-w-0 flex-1 overflow-hidden`,
  title: `truncate text-sm font-medium leading-6 text-text`,
  subtitle: `truncate text-[11px] leading-5 text-text-muted`,
  right: `flex shrink-0 flex-col items-end gap-1`,
  time: `text-[10px] text-text-muted`,
};
