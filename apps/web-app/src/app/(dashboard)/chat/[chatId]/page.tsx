import { WebAssistantChat } from "../../../../features/assistant-chat/AssistantChatEntry";

interface ChatPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;

  return <WebAssistantChat chatId={chatId} />;
}
