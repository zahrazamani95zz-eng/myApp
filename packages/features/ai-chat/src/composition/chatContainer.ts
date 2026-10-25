import {
  EnsureConversationUseCase,
  LoadConversationUseCase,
  LoadConversationsUseCase,
  LoadMessagesUseCase,
  ReceiveMessageUseCase,
  DeleteMessageUseCase,
  EditMessageUseCase,
  UploadAttachmentUseCase,
  SaveDraftUseCase,
  LoadDraftUseCase,
  DeleteDraftUseCase,
  LoadConversationContentUseCase,
  DeleteConversationUseCase,
  SendMessageFeedbackUseCase,
  SaveMessageTranscriptionUseCase,
  SaveMessageErrorUseCase,
  IndexedDbChatRepository,
  IndexedDbDraftRepository,
  LocalUploadRepository,
  HttpChatHistoryGateway,
  ChatDatabase,
} from "@super-app/features-chat-core";
import {
  SendChatMessageUseCase,
  SendVoiceMessageUseCase,
  GenerateSpeechForMessageUseCase,
  ReplyMessageUseCase,
} from "../application";
import {
  HttpChatGateway,
  HttpTtsGateway,
  HttpVoiceMessageGateway,
  MqttChatGateway,
} from "../infrastructure";

export interface ChatContainerConfig {
  storageKey: string;
  apiBaseUrl: string;
  historyBaseUrl: string;
  feedbackUrl: string;
  ttsBaseUrl: string;
  voiceBaseUrl: string;
  mqtt: {
    url: string;
    username?: string;
    password?: string;
    replyTopic?: (chatId: string) => string;
  };
}

export interface ChatContainer {
  gateway: MqttChatGateway;
  realtimeGateway: MqttChatGateway;
  ensureConversation: EnsureConversationUseCase;
  loadConversation: LoadConversationUseCase;
  loadConversations: LoadConversationsUseCase;
  loadMessages: LoadMessagesUseCase;
  loadConversationContent: LoadConversationContentUseCase;
  receiveMessage: ReceiveMessageUseCase;
  sendChatMessage: SendChatMessageUseCase;
  sendVoiceMessage: SendVoiceMessageUseCase;
  ttsGateway: HttpTtsGateway;
  generateSpeechForMessage: GenerateSpeechForMessageUseCase;
  deleteMessage: DeleteMessageUseCase;
  editMessage: EditMessageUseCase;
  replyMessage: ReplyMessageUseCase;
  uploadAttachment: UploadAttachmentUseCase;
  saveDraft: SaveDraftUseCase;
  loadDraft: LoadDraftUseCase;
  deleteDraft: DeleteDraftUseCase;
  sendMessageFeedback: SendMessageFeedbackUseCase;
  saveMessageTranscription: SaveMessageTranscriptionUseCase;
  saveMessageError: SaveMessageErrorUseCase;
  deleteConversation: DeleteConversationUseCase;
}

export function createChatContainer(
  config: ChatContainerConfig,
): ChatContainer {
  const database = new ChatDatabase(`super-app-chat-${config.storageKey}`);
  const chatRepository = new IndexedDbChatRepository(database);
  const draftRepository = new IndexedDbDraftRepository(database);
  const mqttGateway = new MqttChatGateway(config.mqtt);
  const historyGateway = new HttpChatHistoryGateway({
    historyBaseUrl: config.historyBaseUrl,
    feedbackUrl: config.feedbackUrl,
  });
  const aiGateway = new HttpChatGateway(config.apiBaseUrl, () =>
    mqttGateway.getReplySessionId(),
  );
  const uploadRepository = new LocalUploadRepository();
  const ttsGateway = new HttpTtsGateway(config.ttsBaseUrl);
  const voiceMessageGateway = new HttpVoiceMessageGateway(
    config.voiceBaseUrl,
    () => mqttGateway.getReplySessionId(),
  );

  return {
    gateway: mqttGateway,
    realtimeGateway: mqttGateway,

    ensureConversation: new EnsureConversationUseCase(chatRepository),
    loadConversation: new LoadConversationUseCase(chatRepository),
    loadConversations: new LoadConversationsUseCase(
      chatRepository,
      historyGateway,
    ),
    loadMessages: new LoadMessagesUseCase(chatRepository),
    loadConversationContent: new LoadConversationContentUseCase(
      chatRepository,
      historyGateway,
    ),
    receiveMessage: new ReceiveMessageUseCase(chatRepository),

    sendChatMessage: new SendChatMessageUseCase(chatRepository, aiGateway),
    sendVoiceMessage: new SendVoiceMessageUseCase(
      chatRepository,
      voiceMessageGateway,
    ),
    ttsGateway,
    generateSpeechForMessage: new GenerateSpeechForMessageUseCase(
      chatRepository,
      ttsGateway,
    ),

    deleteMessage: new DeleteMessageUseCase(chatRepository),
    editMessage: new EditMessageUseCase(chatRepository),
    replyMessage: new ReplyMessageUseCase(chatRepository, aiGateway),
    uploadAttachment: new UploadAttachmentUseCase(
      chatRepository,
      uploadRepository,
    ),

    saveDraft: new SaveDraftUseCase(draftRepository),
    loadDraft: new LoadDraftUseCase(draftRepository),
    deleteDraft: new DeleteDraftUseCase(draftRepository),

    sendMessageFeedback: new SendMessageFeedbackUseCase(
      historyGateway,
      chatRepository,
    ),
    saveMessageTranscription: new SaveMessageTranscriptionUseCase(
      chatRepository,
    ),
    saveMessageError: new SaveMessageErrorUseCase(chatRepository),
    deleteConversation: new DeleteConversationUseCase(
      chatRepository,
      historyGateway,
    ),
  };
}
