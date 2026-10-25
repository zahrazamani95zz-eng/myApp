"use client";

import * as React from "react";

import { Dialog, DialogContent } from "../dialog";

import { Command } from "./Command";

export function CommandDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden">
        <Command className="w-full">{children}</Command>
      </DialogContent>
    </Dialog>
  );
}
