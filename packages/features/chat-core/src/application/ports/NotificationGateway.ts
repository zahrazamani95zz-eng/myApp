export interface NotificationGateway {
  markRead(conversationId: string): Promise<void>;
}
