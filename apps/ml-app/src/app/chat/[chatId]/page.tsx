import { ProjectWorkspace } from "../../../features/projects/ProjectWorkspace";

interface MlChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function MlChatPage({ params }: MlChatPageProps) {
  const { chatId } = await params;

  return <ProjectWorkspace initialMenu="assistant" chatId={chatId} />;
}
