/** Build an exact MQTT reply topic from an untrusted conversation identifier. */
export function buildChatReplyTopic(
  chatId: string,
  customReplyTopic?: (chatId: string) => string,
): string {
  if (
    typeof chatId !== "string" ||
    chatId.trim().length === 0 ||
    chatId.length > 128 ||
    // eslint-disable-next-line no-control-regex
    /[+#/\\\u0000-\u001f\u007f]/.test(chatId)
  ) {
    throw new Error("Invalid chat identifier for MQTT topic.");
  }

  const topic = customReplyTopic
    ? customReplyTopic(chatId)
    : `hermes/chat/${chatId}/replies`;

  // Wildcards would turn an intended per-chat subscription into a broad
  // subscription. Control characters and empty topic levels are rejected too.
  if (
    typeof topic !== "string" ||
    topic.length === 0 ||
    topic.length > 65535 ||
    topic.startsWith("/") ||
    topic.endsWith("/") ||
    // eslint-disable-next-line no-control-regex
    /[+#\\\u0000-\u001f\u007f]/.test(topic) ||
    topic.split("/").some((level) => level.length === 0)
  ) {
    throw new Error("Invalid MQTT reply topic configuration.");
  }

  return topic;
}
