import type { ChatHistoryGateway } from "../../application";
import type { ConversationPage, MessagePage } from "../../domain";
import type { AxiosInstance } from "axios";

import { createHistoryApi } from "@super-app/shared/lib";

import {
  ConversationContentMapper,
  ConversationHistoryMapper,
} from "../mappers";
import type { ConversationHistoryResponseDto } from "../models/ConversationHistoryResponse";
import { ConversationContentResponseDto } from "../models/ConversationContentResponse";
import { normalizeChatError } from "../errors";

export class HttpChatHistoryGateway implements ChatHistoryGateway {
  private readonly historyApi: AxiosInstance;
  private readonly feedbackUrl: string;

  constructor(config: { historyBaseUrl: string; feedbackUrl: string }) {
    this.historyApi = createHistoryApi(config.historyBaseUrl);
    this.feedbackUrl = config.feedbackUrl;
  }

  async loadConversations(
    page: number,
    perPage: number,
  ): Promise<ConversationPage> {
    try {
      const { data } =
        await this.historyApi.get<ConversationHistoryResponseDto>("/chat/all", {
          params: { page, per_page: perPage },
          headers: {
            "Tenant-ID": "e6a3dc62-7fbc-4eb1-aa12-771be84ef444",
            "User-ID": "e6a3dc62-7fbc-4eb1-aa12-771be84ef444",
          },
        });

      return {
        items: data.chats.map(ConversationHistoryMapper.toDomain),
        page: data.page,
        hasMore: data.page * data.per_page < data.total,
      };
    } catch (error) {
      throw normalizeChatError(
        error,
        "دریافت مکالمات انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  }

  async loadConversationContent(
    chatId: string,
    _page: number,
    _perPage: number,
  ): Promise<MessagePage> {
    try {
      const { data } =
        await this.historyApi.get<ConversationContentResponseDto>(
          `/chat/content/${encodeURIComponent(chatId)}`,
        );

      return {
        items: data.messages.map((message) =>
          ConversationContentMapper.toDomain(message, data.chat_id),
        ),
        page: data.page,
        hasMore: data.page * data.per_page < data.total,
      };
    } catch (error) {
      throw normalizeChatError(
        error,
        "دریافت پیام‌های مکالمه انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  }

  async deleteConversation(chatId: string): Promise<void> {
    try {
      await this.historyApi.delete(`/chat/clear/${encodeURIComponent(chatId)}`);
    } catch (error) {
      throw normalizeChatError(
        error,
        "حذف مکالمه انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  }

  async pinConversation(_chatId: string, _pinned: boolean): Promise<void> {
    // Do not guess an endpoint here: the previous implementation called the
    // destructive /chat/clear endpoint, which could erase the conversation.
    // Pinning remains unavailable until the history API defines a real endpoint.
    throw new Error(
      "Pinning conversations is unavailable: the history API endpoint is not configured.",
    );
  }

  async sendMessageFeedback(messageId: string, isLike: boolean): Promise<void> {
    try {
      if (!this.feedbackUrl) {
        throw new Error("Feedback URL is not configured.");
      }

      const response = await fetch(this.feedbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Id":
            process.env.NEXT_PUBLIC_TENANT_ID ??
            "e6a3dc62-7fbc-4eb1-aa12-771be84ef444",
          "X-User-Id":
            process.env.NEXT_PUBLIC_USER_ID ??
            "e6a3dc62-7fbc-4eb1-aa12-771be84ef444",
        },
        // credentials: "include",
        body: JSON.stringify({ messageId, isLike }),
      });

      if (!response.ok) {
        let detail: unknown;
        try {
          detail = await response.json();
        } catch {
          detail = undefined;
        }
        throw Object.assign(new Error("Message feedback failed"), {
          response: { status: response.status, data: detail },
        });
      }
    } catch (error) {
      throw normalizeChatError(
        error,
        "ثبت بازخورد انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  }
}
