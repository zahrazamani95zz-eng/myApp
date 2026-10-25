import { createAssistantChatStore } from "@super-app/features-assistant-chat";
import { webChatContainer } from "./chatContainer";

export const webChatBindings = createAssistantChatStore(webChatContainer);
