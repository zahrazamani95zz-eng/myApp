import { createSlice } from "@reduxjs/toolkit";

import type { ConversationState } from "./conversation.types";
import type { ChatMessageState } from "./types";

import { initialState } from "./state";
import type { ChatThunks } from "./chatThunks";
import type { ConversationThunks } from "./conversationThunks";
import type { DeleteConversationThunk } from "./deleteConversationThunk";

import { MessageStatus } from "@super-app/features-chat-core/domain";

function mergeConversations(
  existing: ConversationState[],
  incoming: ConversationState[],
): ConversationState[] {
  const incomingIds = new Set(incoming.map((conversation) => conversation.id));
  const localOnly = existing.filter(
    (conversation) => !incomingIds.has(conversation.id),
  );

  const mergedIncoming = incoming.map((conversation) => {
    const existingConversation = existing.find(
      (item) => item.id === conversation.id,
    );
    if (!existingConversation) return conversation;

    return {
      ...conversation,
      unreadCount: Math.max(
        existingConversation.unreadCount,
        conversation.unreadCount,
      ),
    };
  });

  return [...localOnly, ...mergedIncoming].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function mergeMessages(
  existing: ChatMessageState[],
  incoming: ChatMessageState[],
): ChatMessageState[] {
  const byId = new Map(existing.map((message) => [message.id, message]));

  for (const message of incoming) {
    const existingEntry = [...byId.values()].find(
      (current) =>
        current.id === message.id ||
        (message.correlationId &&
          current.correlationId === message.correlationId &&
          current.senderId === message.senderId),
    );

    if (existingEntry && existingEntry.id !== message.id) {
      byId.delete(existingEntry.id);
    }

    const merged: ChatMessageState = existingEntry
      ? {
          ...existingEntry,
          ...message,
          feedback: message.feedback ?? existingEntry.feedback,
          error: message.error ?? existingEntry.error,
          transcription: message.transcription ?? existingEntry.transcription,
          audioId: message.audioId ?? existingEntry.audioId,
          audioUrl: message.audioUrl ?? existingEntry.audioUrl,
          audioFormat: message.audioFormat ?? existingEntry.audioFormat,
          durationMs: message.durationMs ?? existingEntry.durationMs,
        }
      : message;

    byId.set(message.id, merged);
  }

  return [...byId.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function createChatSlice(
  thunks: ChatThunks &
    ConversationThunks & { deleteConversation: DeleteConversationThunk },
) {
  const chatSlice = createSlice({
    name: "chat",

    initialState,

    reducers: {
      addMessage(state, action) {
        const exists = state.messages.some(
          (message) =>
            message.id === action.payload.id ||
            (action.payload.correlationId &&
              message.correlationId === action.payload.correlationId &&
              message.senderId === action.payload.senderId),
        );

        if (!exists) {
          state.messages.push(action.payload);
        }
      },

      setResponsePending(
        state,
        action: {
          payload: {
            pending: boolean;
            correlationId?: string | null;
            conversationId?: string | null;
          };
        },
      ) {
        state.responsePending = action.payload.pending;
        state.responseCorrelationId = action.payload.pending
          ? (action.payload.correlationId ?? null)
          : null;
        state.responseConversationId = action.payload.pending
          ? (action.payload.conversationId ?? null)
          : null;
      },

      setMessageError(
        state,
        action: { payload: { messageId: string; error?: string } },
      ) {
        const message = state.messages.find(
          (item) => item.id === action.payload.messageId,
        );

        if (!message) return;

        message.error = action.payload.error;
        if (action.payload.error) {
          message.status = MessageStatus.FAILED;
        }
        message.updatedAt = new Date().toISOString();
      },

      updateMessageStatus(state, action) {
        const message = state.messages.find((m) => m.id === action.payload.id);

        if (message) {
          message.status = action.payload.status;
        }
      },

      clearError(state) {
        state.error = null;
        state.conversationNotFound = false;
      },

      resetChat(state) {
        state.conversationId = null;
        state.messages = [];
        state.loading = false;
        state.conversationLoadRequestId = null;
        state.responsePending = false;
        state.responseCorrelationId = null;
        state.responseConversationId = null;
        state.error = null;
        state.conversationNotFound = false;
      },

      replaceMessage(state, action) {
        const index = state.messages.findIndex(
          (m) => m.id === action.payload.tempId,
        );

        if (index >= 0) {
          state.messages[index] = action.payload.message;
        } else {
          state.messages.push(action.payload.message);
        }
      },

      setConversationId(state, action) {
        state.conversationId = action.payload;
      },

      markConversationRead(state, action) {
        const conversation = state.conversations.find(
          (item) => item.id === action.payload,
        );

        if (conversation) {
          conversation.unreadCount = 0;
        }
      },

      markConversationUnread(state, action) {
        const { conversationId, lastMessage } = action.payload;
        const conversation = state.conversations.find(
          (item) => item.id === conversationId,
        );

        if (!conversation) return;

        conversation.unreadCount += 1;
        if (lastMessage) {
          conversation.lastMessage = lastMessage;
        }
        conversation.updatedAt = new Date().toISOString();

        const index = state.conversations.indexOf(conversation);
        if (index > 0) {
          state.conversations.splice(index, 1);
          state.conversations.unshift(conversation);
        }
      },

      setConversations(state, action) {
        state.conversations = action.payload;
      },

      appendStreamingChunk(state, action) {
        const { id, chunk, done, chatId } = action.payload;

        let message = state.messages.find(
          (item) =>
            item.senderId === "assistant" &&
            (item.id === id || item.correlationId === id),
        );

        if (!message) {
          message = {
            id,
            correlationId: id,
            conversationId: chatId ?? state.conversationId ?? "",
            senderId: "assistant",
            text: chunk,
            type: "text",
            status: done ? MessageStatus.SENT : MessageStatus.SENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            streaming: !done,
            error: undefined,
          };

          state.messages.push(message);
        } else {
          if (!done) {
            message.text += chunk;
          } else if (!message.text) {
            message.text = chunk;
          } else if (chunk.length >= message.text.length) {
            message.text = chunk;
          }

          message.streaming = !done;
          message.status = done ? MessageStatus.SENT : MessageStatus.SENDING;
          message.updatedAt = new Date().toISOString();
        }
      },
      finishStreaming(state, action) {
        const { id, text } = action.payload;

        const message = state.messages.find(
          (m) => m.id === id || m.correlationId === id,
        );

        if (!message) return;

        message.text = text;

        message.correlationId = id;

        message.streaming = false;

        message.status = MessageStatus.SENT;

        message.updatedAt = new Date().toISOString();
      },
      startConversation(state, action) {
        state.conversationId = action.payload.id;
        state.error = null;

        const existingIndex = state.conversations.findIndex(
          (conversation) => conversation.id === action.payload.id,
        );

        if (existingIndex >= 0) {
          state.conversations[existingIndex] = {
            ...state.conversations[existingIndex],
            ...action.payload,
          };
          return;
        }

        state.conversations.unshift(action.payload);
      },

      addConversation(state, action) {
        const exists = state.conversations.some(
          (c) => c.id === action.payload.id,
        );

        if (exists) {
          return;
        }

        state.conversations.unshift(action.payload);
      },

      toggleConversationPin(state, action) {
        const conversation = state.conversations.find(
          (item) => item.id === action.payload,
        );

        if (!conversation) return;

        conversation.isPinned = !conversation.isPinned;
      },

      removeConversation(state, action) {
        state.conversations = state.conversations.filter(
          (item) => item.id !== action.payload,
        );
      },

      setConversationNotFound(state, action) {
        state.conversationNotFound = Boolean(action.payload);
      },

      setMessageTranscription(state, action) {
        const message = state.messages.find(
          (item) =>
            item.senderId === "user" &&
            item.correlationId === action.payload.correlationId,
        );

        if (message) {
          message.transcription = action.payload.text;
          message.correlationId = action.payload.correlationId;
          message.streaming = false;
          message.updatedAt = new Date().toISOString();
        }
      },

      setMessageFeedback(state, action) {
        const message = state.messages.find(
          (item) => item.id === action.payload.messageId,
        );

        if (message) {
          message.feedback = action.payload.feedback;
        }
      },

      updateMessageAudio(state, action) {
        const message = state.messages.find(
          (item) =>
            item.id === action.payload.id ||
            (action.payload.correlationId &&
              item.correlationId === action.payload.correlationId &&
              item.senderId === "assistant"),
        );

        if (!message) return;

        Object.assign(message, action.payload.audio);
        message.updatedAt = new Date().toISOString();
      },
    },

    extraReducers(builder) {
      builder

        // ---------------- Conversations ----------------

        .addCase(thunks.loadConversations.pending, (state) => {
          state.conversationsLoading = true;
        })

        .addCase(thunks.loadConversations.fulfilled, (state, action) => {
          state.conversationsLoading = false;
          state.conversationsLoaded = true;

          state.conversations = mergeConversations(
            state.conversations,
            action.payload.conversations,
          );

          state.currentConversationPage = action.payload.page;

          state.hasMoreConversations = action.payload.hasMore;
        })

        .addCase(thunks.loadConversations.rejected, (state, action) => {
          state.conversationsLoading = false;

          state.error = action.error.message ?? "Failed";
        })
        // ---------------- Messages ----------------

        .addCase(thunks.loadMessages.pending, (state) => {
          state.loading = true;
          state.error = null;
        })

        .addCase(thunks.loadMessages.fulfilled, (state, action) => {
          state.loading = false;
          state.messages = [...action.payload];
        })

        .addCase(thunks.loadMessages.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message ?? "Unknown error";
        })

        .addCase(thunks.loadConversationContent.pending, (state, action) => {
          // A route transition can leave an older request in flight. Only the
          // request for the currently active conversation may mutate loading
          // or message state.
          if (state.conversationId !== action.meta.arg.chatId) {
            return;
          }

          state.loading = true;
          state.conversationLoadRequestId = action.meta.requestId;
          state.error = null;
          state.conversationNotFound = false;

          // Keep locally-created/sending messages while the server content loads.
          state.messages = state.messages.filter(
            (message) => message.conversationId === action.meta.arg.chatId,
          );
        })

        .addCase(thunks.loadConversationContent.fulfilled, (state, action) => {
          // Ignore stale responses after the user navigated elsewhere.
          if (
            state.conversationId !== action.payload.chatId ||
            state.conversationLoadRequestId !== action.meta.requestId
          ) {
            return;
          }

          state.loading = false;
          state.conversationLoadRequestId = null;

          if (action.payload.warning) {
            state.error = action.payload.warning;
          }

          if (action.payload.page === 1) {
            state.messages = mergeMessages(
              state.messages,
              action.payload.messages,
            );

            state.conversationNotFound = action.payload.messages.length === 0;
          } else {
            state.messages = mergeMessages(
              state.messages,
              action.payload.messages,
            );
          }
        })

        .addCase(thunks.loadConversationContent.rejected, (state, action) => {
          // Do not let an older request change the current route's loading or
          // error state after navigation.
          if (
            state.conversationId !== action.meta.arg.chatId ||
            state.conversationLoadRequestId !== action.meta.requestId
          ) {
            return;
          }

          state.loading = false;
          state.conversationLoadRequestId = null;
          state.conversationNotFound = false;
          state.error = action.error.message ?? "Failed to load conversation";
        })

        // ---------------- Send ----------------

        .addCase(thunks.sendMessage.fulfilled, (state, action) => {
          const payload = action.payload;
          const isCurrentRequest =
            state.conversationId === payload.requestConversationId;

          // Always reconcile the conversation list, even when the user has
          // already navigated away. This allows the completed background
          // conversation to appear in history with an unread marker.
          const temporaryId = payload.temporaryConversationId;
          const temporaryIndex = temporaryId
            ? state.conversations.findIndex(
                (conversation) => conversation.id === temporaryId,
              )
            : -1;
          const realIndex = state.conversations.findIndex(
            (conversation) => conversation.id === payload.conversation.id,
          );

          if (
            temporaryIndex >= 0 &&
            realIndex >= 0 &&
            temporaryIndex !== realIndex
          ) {
            state.conversations.splice(temporaryIndex, 1);
            const adjustedRealIndex =
              realIndex > temporaryIndex ? realIndex - 1 : realIndex;
            state.conversations.splice(adjustedRealIndex, 1);
          } else if (temporaryIndex >= 0) {
            state.conversations.splice(temporaryIndex, 1);
          } else if (realIndex >= 0) {
            state.conversations.splice(realIndex, 1);
          }

          state.conversations.unshift(payload.conversation);

          if (!isCurrentRequest) {
            return;
          }

          state.error = null;
          state.responsePending = true;
          state.responseCorrelationId = payload.correlationId;
          state.responseConversationId = payload.chatId;
          state.conversationId = payload.chatId;
        })

        .addCase(thunks.sendMessage.rejected, (state, action) => {
          if (state.conversationId !== action.meta.arg.conversationId) {
            return;
          }

          state.responsePending = false;
          state.responseCorrelationId = null;
          state.responseConversationId = null;
        })

        // ---------------- Delete Conversation ----------------
        .addCase(thunks.deleteConversation.pending, (state) => {
          state.loading = true;
          state.error = null;
        })

        .addCase(thunks.deleteConversation.fulfilled, (state, action) => {
          state.loading = false;

          state.conversations = state.conversations.filter(
            (conversation) => conversation.id !== action.payload,
          );
        })

        .addCase(thunks.deleteConversation.rejected, (state, action) => {
          state.loading = false;

          state.error = action.error.message ?? "Failed to delete conversation";
        })

        .addCase(thunks.sendVoiceMessage.fulfilled, (state, action) => {
          const payload = action.payload;
          const isCurrentRequest =
            state.conversationId === payload.requestConversationId;

          const conversation = payload.conversation;

          if (conversation) {
            const existingIndex = state.conversations.findIndex(
              (item) => item.id === conversation.id,
            );

            if (existingIndex >= 0) {
              state.conversations.splice(existingIndex, 1);
            }

            state.conversations.unshift(conversation);
          }

          if (!isCurrentRequest) {
            return;
          }

          state.error = null;
          state.responsePending = true;
          state.responseCorrelationId = payload.correlationId ?? null;
          state.responseConversationId = payload.chatId;
          state.conversationId = payload.chatId;

          const message = state.messages.find(
            (item) => item.id === payload.message.id,
          );

          if (message) {
            message.conversationId = payload.chatId;
            message.correlationId = payload.correlationId;
            message.status = payload.message.status;
          } else {
            state.messages.push({
              ...payload.message,
              conversationId: payload.chatId,
              correlationId: payload.correlationId,
              streaming: false,
            });
          }
        })
        // ---------------- Receive MQTT ----------------

        .addCase(thunks.sendVoiceMessage.rejected, (state, action) => {
          if (state.conversationId !== action.meta.arg.conversationId) {
            return;
          }

          state.responsePending = false;
          state.responseCorrelationId = null;
          state.responseConversationId = null;
        })

        .addCase(thunks.receiveMessage.fulfilled, (state, action) => {
          const incoming = action.payload;
          const index = state.messages.findIndex(
            (message) =>
              (message.id === incoming.id &&
                message.senderId === incoming.senderId) ||
              (incoming.correlationId &&
                message.correlationId === incoming.correlationId &&
                message.senderId === incoming.senderId),
          );

          if (
            state.responseCorrelationId &&
            incoming.correlationId === state.responseCorrelationId
          ) {
            state.responsePending = false;
            state.responseCorrelationId = null;
            state.responseConversationId = null;
          }

          if (index >= 0) {
            const existing = state.messages[index];

            state.messages[index] = {
              ...existing,
              ...incoming,
              // Keep the UI identity of an already-streaming assistant message.
              // The backend correlation id is a request id, not a message id.
              id: existing.id,
              // A terminal MQTT response owns the assistant bubble's text.
              // Never copy it into the user's voice message.
              text: incoming.text,
              correlationId: incoming.correlationId ?? existing.correlationId,
              status: incoming.status,
              updatedAt: incoming.updatedAt,
              streaming: false,
            };
          } else {
            state.messages.push({
              ...incoming,
              correlationId: incoming.correlationId ?? incoming.id,
              streaming: false,
            });
          }
        });
    },
  });

  return {
    reducer: chatSlice.reducer,
    actions: chatSlice.actions,
  };
}
