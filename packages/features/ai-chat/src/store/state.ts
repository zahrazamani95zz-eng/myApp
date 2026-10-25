import { ConversationState } from "./conversation.types";
import type { ChatMessageState } from "./types";

export interface ChatState {
  conversationId: string | null;

  messages: ChatMessageState[];

  loading: boolean;

  conversationLoadRequestId: string | null;

  responsePending: boolean;

  responseCorrelationId: string | null;

  responseConversationId: string | null;

  conversationsLoading: boolean;

  conversationsLoaded: boolean;
  error: string | null;

  conversations: ConversationState[];

  currentConversationPage: number;

  hasMoreConversations: boolean;

  conversationNotFound: boolean;
}

export const initialState: ChatState = {
  conversationId: null,

  messages: [],

  loading: false,

  conversationLoadRequestId: null,

  responsePending: false,

  responseCorrelationId: null,

  responseConversationId: null,

  conversationsLoading: false,

  conversationsLoaded: false,

  error: null,

  conversations: [],

  currentConversationPage: 1,

  hasMoreConversations: true,

  conversationNotFound: false,
};
