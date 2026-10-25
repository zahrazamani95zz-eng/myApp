/**
 * Voice message player styles — layout matches Widget reference,
 * colors come from the app theme tokens (primary, danger, text-muted, …).
 */
export const voiceMessagePlayerStyles = {
  root: `
    flex
    w-full
    max-w-[340px]
    items-center
    gap-3
    py-[5px]
    px-px
  `,

  play: `
    grid
    h-[30px]
    w-[30px]
    shrink-0
    place-items-center
    rounded-full
    border-0
    text-[13px]
    leading-none
    text-white
    transition-[transform,opacity]
    duration-150
    ease-out
    active:enabled:scale-[0.94]
    disabled:cursor-not-allowed
    disabled:opacity-[0.82]
  `,

  playAssistant: `
    bg-primary
    shadow-[0_4px_12px_color-mix(in_srgb,var(--primary)_22%,transparent)]
  `,

  playUser: `
    bg-white/20
    shadow-[0_4px_12px_rgba(0,0,0,0.08)]
  `,

  playError: `
    bg-danger/15
    text-danger
    shadow-none
  `,

  spinner: `
    inline-block
    h-[19px]
    w-[19px]
    animate-[voice-message-spin_0.7s_linear_infinite]
    rounded-full
    border-2
    border-white/40
    border-t-white
  `,

  body: `
    relative
    flex
    min-w-0
    flex-1
    flex-col
    gap-0.5
  `,

  waveform: `
    relative
    mt-2.5
    h-5
    w-full
    cursor-pointer
    overflow-hidden
  `,

  waveformLayer: `
    absolute
    inset-0
    flex
    items-center
    justify-between
    gap-0.5
    pointer-events-none
  `,

  waveformBase: `
    opacity-[0.34]
  `,

  waveformBaseLoading: `
    animate-[voice-message-wave-loading_1.2s_ease-in-out_infinite]
  `,

  bar: `
    max-w-[3px]
    min-w-[3px]
    w-[3px]
    rounded
  `,

  barAssistant: `
    bg-primary
  `,

  barUser: `
    bg-white/[0.92]
  `,

  progress: `
    absolute
    inset-x-0
    top-0
    z-[2]
    m-0
    h-[34px]
    w-full
    cursor-pointer
    opacity-0
    disabled:cursor-not-allowed
  `,

  meta: `
    flex
    items-center
    justify-between
    text-[10px]
    leading-[1.1]
    tabular-nums
  `,

  metaAssistant: `
    text-text-muted
  `,

  metaUser: `
    text-white/80
  `,
} as const;
