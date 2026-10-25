"use client";

import { useState } from "react";
import { MoreHorizontal, Pin, Trash2 } from "lucide-react";

import { cn } from "@super-app/shared/lib";
import type { ChangeEvent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Avatar,
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@super-app/shared/ui";

import { ConversationItemProps } from "./ConversationItem.types";
import { conversationItemStyles } from "./ConversationItem.styles";

export function ConversationItem({
  conversation,
  active,
  onClick,
  onPin,
  onDelete,
}: ConversationItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(conversation.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          conversationItemStyles.root,
          active && conversationItemStyles.active,
        )}
      >
        {/* Conversation */}
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          onClick={onClick}
        >
          <Avatar />

          <div className={conversationItemStyles.content}>
            <p className={conversationItemStyles.title}>{conversation.title}</p>

            <p className={conversationItemStyles.subtitle}>
              {conversation.lastMessage}
            </p>
          </div>

          <div className={conversationItemStyles.right}>
            <span className={conversationItemStyles.time}>
              {conversation.updatedAt}
            </span>

            {!!conversation.unreadCount && (
              <span
                aria-label="مکالمه خوانده نشده"
                className="h-2 w-2 shrink-0 rounded-full bg-success shadow-[0_0_0_3px_color-mix(in_srgb,var(--success)_12%,transparent)]"
              />
            )}
          </div>
        </button>

        {/* More menu */}
        <Dropdown>
          <DropdownTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="
                h-8
                w-8
                shrink-0
                opacity-0
                transition-opacity
                group-hover:opacity-100
              "
              onClick={(event: ChangeEvent<HTMLInputElement>) => {
                event.stopPropagation();
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownTrigger>

          <DropdownContent>
            {/* Pin */}
            <DropdownItem
              onSelect={() => {
                onPin(conversation.id);
              }}
            >
              <Pin className="mr-2 h-4 w-4" />

              {conversation.isPinned ? "Unpin" : "Pin"}
            </DropdownItem>

            {/* Delete */}
            <DropdownItem
              className="text-destructive"
              onSelect={handleDeleteClick}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف مکالمه</AlertDialogTitle>

            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید این مکالمه را حذف کنید؟ این عملیات
              قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
