import {
  createChatContainer,
  type ChatContainer,
} from "@super-app/features-ai-chat/composition";

export const webChatContainer: ChatContainer = createChatContainer({
  storageKey: "web-app",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  historyBaseUrl: process.env.NEXT_PUBLIC_API_HISTORY_URL ?? "",
  feedbackUrl: process.env.NEXT_PUBLIC_FEEDBACK_URL ?? "",
  ttsBaseUrl: process.env.NEXT_PUBLIC_TTS_BASE_URL ?? "",
  voiceBaseUrl: process.env.NEXT_PUBLIC_VOICE_BASE_URL ?? "",
  mqtt: {
    url: process.env.NEXT_PUBLIC_EMQX_WS_URL ?? "",
    username: process.env.NEXT_PUBLIC_EMQX_USERNAME,
    password: process.env.NEXT_PUBLIC_EMQX_PASSWORD,
    replyTopic: (chatId) =>
      `${process.env.NEXT_PUBLIC_EMQX_REPLY_TOPIC_PREFIX ?? "hermes/chat"}/${chatId}/replies`,
  },
});
