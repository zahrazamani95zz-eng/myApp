export const MqttConfig = {
  url: process.env.NEXT_PUBLIC_EMQX_WS_URL!,

  username: process.env.NEXT_PUBLIC_EMQX_USERNAME,

  password: process.env.NEXT_PUBLIC_EMQX_PASSWORD,

  topicPrefix: process.env.NEXT_PUBLIC_EMQX_TOPIC_PREFIX ?? "bki-chat-",
};
