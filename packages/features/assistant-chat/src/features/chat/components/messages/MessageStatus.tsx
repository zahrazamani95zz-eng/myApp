"use client";

import { Check, CheckCheck, Clock3, AlertCircle } from "lucide-react";

import { MessageStatus as MessageStatusEnum } from "@super-app/features-chat-core/domain";

interface Props {
  status: MessageStatusEnum;
}

export function MessageStatus({ status }: Props) {
  switch (status) {
    case MessageStatusEnum.SENDING:
      return <Clock3 size={12} className="text-text-secondary" />;

    case MessageStatusEnum.SENT:
      return <Check size={12} className="text-text-secondary" />;

    case MessageStatusEnum.FAILED:
      return <AlertCircle size={12} className="text-destructive" />;

    default:
      return <CheckCheck size={12} className="text-primary" />;
  }
}
