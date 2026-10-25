"use client";

import { useEffect } from "react";

import { useAppSelector } from "../../../../store";
import { useDraft } from "../../hooks/useDraft";
import { useChatComposer } from "../../hooks/useChatComposer";
import { useChatAttachments } from "../../hooks/useChatAttachments";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";

import { AttachmentPreview } from "./AttachmentPreview";
import { ComposerTextarea } from "./ComposerTextarea";
import { ComposerToolbar } from "./ComposerToolbar";
import { VoiceRecorder } from "./VoiceRecorder";

export function ChatComposer() {
  const { value, setValue, send, sendVoice, responsePending } =
    useChatComposer();

  const { save, load } = useDraft();

  const conversationId = useAppSelector((state) => state.chat.conversationId);

  const { files, addFiles, removeFile, clearFiles } = useChatAttachments();

  const {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder();

  const handleChange = async (text: string) => {
    setValue(text);

    if (!conversationId) {
      return;
    }

    await save(conversationId, text);
  };

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const id = conversationId;

    async function restore() {
      const draft = await load(id);

      if (draft) {
        setValue(draft);
      }
    }

    void restore();
  }, [conversationId, load, setValue]);

  const canSend = isRecording || Boolean(value.trim()) || files.length > 0;

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-[26px]
        border border-border/90
        bg-card/96
        shadow-[0_12px_36px_rgba(20,45,37,0.10)]
        backdrop-blur-xl
        transition-[border-color,box-shadow,background-color]
        duration-200
        focus-within:border-primary/45 focus-within:shadow-[0_16px_42px_color-mix(in_srgb,var(--primary)_13%,transparent)]
        dark:border-border/90 dark:bg-card/95 dark:shadow-[0_16px_44px_rgba(0,0,0,0.28)]
        dark:focus-within:border-primary/55 dark:focus-within:shadow-[0_18px_48px_rgba(61,184,137,0.12)]
      "
    >
      {isRecording && (
        <VoiceRecorder duration={duration} onCancel={cancelRecording} />
      )}

      <AttachmentPreview files={files} onRemove={removeFile} />

      <ComposerTextarea
        value={value}
        onChange={handleChange}
        onSubmit={send}
        disabled={responsePending}
      />

      <ComposerToolbar
        disabled={responsePending || !canSend}
        onSend={async () => {
          if (isRecording) {
            const blob = await stopRecording();

            if (blob) {
              const file = new File([blob], `voice-${Date.now()}.webm`, {
                type: blob.type || "audio/webm",
              });

              await sendVoice(file);
            }

            return;
          }

          if (files.length > 0) {
            await sendVoice(files[0]);
            clearFiles();
            return;
          }

          await send();
        }}
        onFilesSelected={addFiles}
        recording={isRecording}
        onStartRecording={startRecording}
      />
    </div>
  );
}
