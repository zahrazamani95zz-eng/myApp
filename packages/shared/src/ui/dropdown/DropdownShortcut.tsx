interface Props {
  children: React.ReactNode;
}

export function DropdownShortcut({ children }: Props) {
  return <span className="ml-auto text-xs text-text-muted">{children}</span>;
}
