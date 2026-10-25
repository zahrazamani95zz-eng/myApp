"use client";

import { ComposerAttachmentButton } from "./ComposerAttachmentButton";
import { ComposerMicButton } from "./ComposerMicButton";
import { LiveVoiceCall } from "../../voice/LiveVoiceCall";

type Props = {
  recording: boolean;
  onStartRecording: () => void;
  onFilesSelected: (files: FileList | null) => void;
};

export function ComposerActions({
  onFilesSelected,
  recording,
  onStartRecording,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <ComposerAttachmentButton onFilesSelected={onFilesSelected} />

      <LiveVoiceCall />

      <ComposerMicButton recording={recording} onStart={onStartRecording} />
    </div>
  );
}
