export interface MqttChatPayload {
  type: string;

  event_type?: string;

  chat_id: string;

  correlation_id: string;

  response?: string;

  language?: string;

  corrected_text?: string;

  raw_text?: string;

  text?: string;

  content?: string;

  done?: boolean;

  status?: string;

  user_id?: string;

  timestamp?: string;

  job_id?: string;
}
