import { createAssistantChatStore } from "@super-app/features-assistant-chat";
import { mlChatContainer } from "./chatContainer";

export const mlChatBindings = createAssistantChatStore(mlChatContainer);
