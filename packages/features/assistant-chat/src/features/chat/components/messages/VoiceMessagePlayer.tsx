"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessageState } from "@super-app/features-ai-chat/store";
import { cn } from "@super-app/shared/lib";
import { Play, Pause } from "lucide-react";
import { voiceMessagePlayerStyles as s } from "./VoiceMessagePlayer.styles";

interface Props {
  message: ChatMessageState;
  /** user = inside primary bubble; assistant = default surface */
  variant?: "user" | "assistant";
}

/** Identical bar heights to Widget reference */
const WAVEFORM_HEIGHTS = [
  8, 14, 20, 11, 25, 17, 29, 13, 23, 31, 18, 27, 12, 22, 30, 16, 26, 10, 21, 28,
  14, 24, 18, 30, 12, 20, 27, 16, 23, 31, 17, 26, 11, 19, 28, 15, 24, 20, 30,
  13, 22, 17, 27, 11, 19, 25, 15, 23, 10, 21, 28, 16, 24, 12, 20, 29, 14, 22,
  18, 26, 11, 20, 30, 16, 24, 13, 21,
];

function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceMessagePlayer({ message, variant = "assistant" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(
    message.durationMs ? message.durationMs / 1000 : 0,
  );
  const [error, setError] = useState(false);

  const isUser = variant === "user";
  const isLoading = message.audioLoading === true;
  const src = message.audioUrl;
  const isErrorState =
    Boolean(message.audioError) || error || (!src && !isLoading);

  const progressPercent =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;

  useEffect(() => {
    setError(false);
    setPlaying(false);
    setCurrentTime(0);
    if (message.durationMs) {
      setDuration(message.durationMs / 1000);
    }
  }, [message.id, message.audioUrl, message.durationMs]);

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
  }, []);

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
  }, []);

  const onEnded = useCallback(() => {
    setPlaying(false);
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) {
      setCurrentTime(audio.duration);
    }
  }, []);

  const onAudioError = useCallback(() => {
    setPlaying(false);
    setError(true);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !src || isErrorState || isLoading) return;

    try {
      if (audio.paused) {
        document
          .querySelectorAll<HTMLAudioElement>("audio")
          .forEach((other) => {
            if (other !== audio && !other.paused) {
              other.pause();
            }
          });
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch {
      setError(true);
      setPlaying(false);
    }
  };

  const onSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || isLoading || isErrorState) return;
    const next = Math.max(0, Math.min(value, duration || value));
    audio.currentTime = next;
    setCurrentTime(next);
  };

  if (!isUser && !src && !isLoading && !message.audioError) {
    return null;
  }

  const barTone = isUser ? s.barUser : s.barAssistant;

  return (
    <div className={cn(s.root)} dir="ltr">
      <button
        type="button"
        disabled={isLoading || isErrorState}
        onClick={() => void toggle()}
        aria-label={
          isLoading
            ? "در حال آماده‌سازی صدا"
            : isErrorState
              ? "پخش صدا در دسترس نیست"
              : playing
                ? "توقف پخش"
                : "پخش پیام صوتی"
        }
        title={isErrorState ? "پخش صدا در دسترس نیست" : undefined}
        className={cn(
          s.play,
          isErrorState ? s.playError : isUser ? s.playUser : s.playAssistant,
        )}
      >
        {isLoading ? (
          <span className={cn(s.spinner)} aria-hidden="true" />
        ) : isErrorState ? (
          "!"
        ) : playing ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>

      <div className={cn(s.body)}>
        <div className={cn(s.waveform)} aria-hidden="true">
          <div
            className={cn(
              s.waveformLayer,
              s.waveformBase,
              isLoading && s.waveformBaseLoading,
            )}
          >
            {WAVEFORM_HEIGHTS.map((h, i) => (
              <span
                key={`base-${i}`}
                className={cn(s.bar, barTone)}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          {!isLoading && !isErrorState && (
            <div
              className={cn(s.waveformLayer)}
              style={{
                clipPath: `inset(0 calc(100% - ${progressPercent}%) 0 0)`,
              }}
            >
              {WAVEFORM_HEIGHTS.map((h, i) => (
                <span
                  key={`prog-${i}`}
                  className={cn(s.bar, barTone)}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          )}
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(0.01, duration)}
          step={0.01}
          value={Math.min(currentTime, duration || currentTime)}
          disabled={isLoading || isErrorState}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="موقعیت پخش صدا"
          aria-valuetext={formatDuration(currentTime)}
          className={cn(s.progress)}
        />

        <div
          className={cn(s.meta, isUser ? s.metaUser : s.metaAssistant)}
          dir="ltr"
        >
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {!isLoading && !isErrorState && src ? (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onError={onAudioError}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
