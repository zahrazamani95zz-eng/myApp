"use client";

import { ComposerActions } from "./ComposerActions";
import { ComposerSendButton } from "./ComposerSendButton";

type Props = {
  disabled: boolean;
  onSend: () => void | Promise<void>;
  onFilesSelected: (files: FileList | null) => void;
  recording: boolean;
  onStartRecording: () => void;
};

export function ComposerToolbar({
  disabled,
  onSend,
  onFilesSelected,
  recording,
  onStartRecording,
}: Props) {
  return (
    <div
      className="
        flex
        min-h-14
        items-center
        justify-between
        gap-2
        bg-transparent
        px-2.5
        py-2
        sm:min-h-15
        sm:px-3
      "
    >
      <ComposerActions
        recording={recording}
        onStartRecording={onStartRecording}
        onFilesSelected={onFilesSelected}
      />

      <div className="flex items-center gap-1.5 sm:gap-2">
        <ComposerSendButton
          disabled={disabled}
          onClick={() => {
            void onSend();
          }}
        />
      </div>
    </div>
  );
}
