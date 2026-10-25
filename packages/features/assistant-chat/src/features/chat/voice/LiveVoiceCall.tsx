"use client";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LoaderCircle,
  Mic,
  MicOff,
  PhoneOff,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  Room,
  RoomEvent,
  Track,
  type Participant,
  type RemoteTrack,
  type RemoteTrackPublication,
  // type DisconnectReason
} from "livekit-client";
import { RoomAudioRenderer, RoomContext } from "@livekit/components-react";
import "@livekit/components-styles";

import { Button } from "@super-app/shared/ui";

type VoiceState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error"
  | "reconnecting";

type ViewState = "call" | "ended";

type VoiceSession = {
  token: string;
  url: string;
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getStatusText(
  state: VoiceState,
  remoteSpeaking: boolean,
  localSpeaking: boolean,
) {
  if (state === "connecting") return "در حال اتصال...";
  if (state === "reconnecting") return "در حال اتصال مجدد...";
  if (state === "error") return "خطا در اتصال";
  if (localSpeaking) return "در حال شنیدن صدای شما";
  if (remoteSpeaking || state === "speaking")
    return "صوت‌تیک در حال صحبت است...";
  if (state === "thinking") return "صوت‌تیک در حال فکر کردن است";
  if (state === "listening") return "در حال گوش دادن...";
  return "آماده تماس";
}

function getTheme(
  state: VoiceState,
  remoteSpeaking: boolean,
  localSpeaking: boolean,
) {
  if (state === "error") {
    return {
      ambient: "bg-[color-mix(in_srgb,var(--danger)_18%,transparent)]",
      ring: "border-[color-mix(in_srgb,var(--danger)_55%,transparent)]",
      glow: "shadow-[0_0_90px_color-mix(in_srgb,var(--danger)_28%,transparent)]",
      coreFrom: "var(--danger)",
      coreTo: "color-mix(in srgb, var(--background) 72%, var(--danger) 28%)",
      highlight: "color-mix(in srgb,var(--danger) 35%,white 65%)",
      text: "var(--text)",
      dot: "bg-danger",
      wave: "text-danger",
    };
  }

  const speaking = remoteSpeaking || localSpeaking || state === "speaking";
  return {
    ambient: speaking
      ? "bg-[color-mix(in_srgb,var(--primary)_18%,transparent)]"
      : "bg-[color-mix(in_srgb,var(--secondary)_12%,transparent)]",
    ring: speaking
      ? "border-[color-mix(in_srgb,var(--primary)_65%,transparent)]"
      : "border-[color-mix(in_srgb,var(--primary)_38%,transparent)]",
    glow: speaking
      ? "shadow-[0_0_100px_color-mix(in_srgb,var(--primary)_30%,transparent)]"
      : "shadow-[0_0_70px_color-mix(in_srgb,var(--primary)_18%,transparent)]",
    coreFrom: "var(--primary)",
    coreTo: "color-mix(in srgb, var(--background) 68%, var(--primary) 32%)",
    highlight: "color-mix(in srgb,var(--primary) 35%,white 65%)",
    text: "var(--text)",
    dot: "bg-success",
    wave: "text-primary",
  };
}

/* ─────────────────────────────────────────────
   Voice Wave – driven by the actual LiveKit audio signal
───────────────────────────────────────────── */
function VoiceWave({
  levels,
  active,
  colorClass,
}: {
  levels: number[];
  active: boolean;
  colorClass: string;
}) {
  const center = (levels.length - 1) / 2;

  return (
    <div
      className={`voice-wave relative flex h-[76px] w-[min(390px,84vw)] items-center justify-center gap-[3px] overflow-visible px-3 ${colorClass} ${
        active ? "voice-wave--active" : "voice-wave--idle"
      }`}
      aria-hidden="true"
    >
      <div className="voice-wave__ambient" />
      <div className="voice-wave__baseline" />
      <div className="voice-wave__reflection" />
      {levels.map((level, index) => {
        const distance = Math.abs(index - center) / center;
        const centerWeight = 0.42 + (1 - distance) * 0.58;
        const edgeFade = 0.45 + (1 - distance) * 0.55;
        const shaped = Math.min(1, level * centerWeight * 1.16);
        const height = 4 + shaped * (active ? 54 : 16);
        const width = distance < 0.28 ? 3.4 : 2.6;
        const opacity = active ? 0.42 + shaped * 0.58 : 0.18 + shaped * 0.28;

        return (
          <span
            key={index}
            className="voice-wave__bar"
            style={{
              width: `${width}px`,
              height: `${height.toFixed(1)}px`,
              opacity: opacity * edgeFade,
              transform: `scaleX(${0.82 + shaped * 0.18})`,
              boxShadow: active
                ? `0 0 ${5 + shaped * 15}px color-mix(in srgb, var(--primary) ${22 + shaped * 48}%, transparent)`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export function LiveVoiceCall() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewState>("call");
  const [room] = useState(() => new Room());
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [remoteSpeaking, setRemoteSpeaking] = useState(false);
  const [localSpeaking, setLocalSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [callStartedAt, setCallStartedAt] = useState<number | null>(null);
  const [waveLevels, setWaveLevels] = useState<number[]>(() =>
    Array(31).fill(0),
  );

  const audioContextRef = useRef<AudioContext | null>(null);
  const analysersRef = useRef<Map<string, AnalyserNode>>(new Map());
  const analyzerSourcesRef = useRef<Map<string, MediaStreamAudioSourceNode>>(
    new Map(),
  );
  const waveFrameRef = useRef<number | null>(null);

  const audioContainerRef = useRef<HTMLDivElement>(null);

  const resetUi = useCallback(() => {
    setState("idle");
    setError(null);
    setRemoteSpeaking(false);
    setLocalSpeaking(false);
    setMicEnabled(true);
    setSpeakerOn(true);
    setDuration(0);
    setCallStartedAt(null);
    setView("call");
  }, []);

  const disconnect = useCallback(
    async (showEnded = false) => {
      await room.disconnect();
      analyzerSourcesRef.current.forEach((source) => source.disconnect());
      analysersRef.current.forEach((analyser) => analyser.disconnect());
      analyzerSourcesRef.current.clear();
      analysersRef.current.clear();
      setWaveLevels(Array(31).fill(0));
      setRemoteSpeaking(false);
      setLocalSpeaking(false);
      setMicEnabled(true);
      if (showEnded && callStartedAt !== null) {
        setView("ended");
        return;
      }
      resetUi();
    },
    [callStartedAt, resetUi, room],
  );

  const getAudioContext = useCallback(async () => {
    if (typeof window === "undefined" || !("AudioContext" in window))
      return null;
    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch {
        // Visualizer is optional.
      }
    }
    return audioContextRef.current;
  }, []);

  const setupTrackAnalyzer = useCallback(
    async (track: MediaStreamTrack, key: string) => {
      if (analysersRef.current.has(key)) return;
      const context = await getAudioContext();
      if (!context) return;
      try {
        const source = context.createMediaStreamSource(
          new MediaStream([track]),
        );
        const analyser = context.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.72;
        analyser.minDecibels = -75;
        analyser.maxDecibels = -10;
        source.connect(analyser);
        analyzerSourcesRef.current.set(key, source);
        analysersRef.current.set(key, analyser);
      } catch (cause) {
        console.debug("Live voice analyzer unavailable", cause);
      }
    },
    [getAudioContext],
  );

  const removeAnalyzer = useCallback((key: string) => {
    analyzerSourcesRef.current.get(key)?.disconnect();
    analysersRef.current.get(key)?.disconnect();
    analyzerSourcesRef.current.delete(key);
    analysersRef.current.delete(key);
  }, []);

  const clearAnalyzers = useCallback(() => {
    analyzerSourcesRef.current.forEach((source) => source.disconnect());
    analysersRef.current.forEach((analyser) => analyser.disconnect());
    analyzerSourcesRef.current.clear();
    analysersRef.current.clear();
    setWaveLevels(Array(31).fill(0));
  }, []);

  useEffect(() => {
    if (waveFrameRef.current !== null) return;

    const draw = () => {
      waveFrameRef.current = window.requestAnimationFrame(draw);
      // Analyze both sides independently. If we only preferred remote tracks,
      // the presence of a subscribed (but currently silent) Agent track would
      // prevent the local microphone from driving the wave.
      const activeAnalysers = Array.from(analysersRef.current.values());

      if (!activeAnalysers.length) {
        setWaveLevels((previous) => previous.map((level) => level * 0.78));
        return;
      }

      let peakRms = 0;
      const frequencyBuffers = activeAnalysers.map((analyser) => {
        const timeData = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(timeData);
        let squareSum = 0;
        for (let i = 0; i < timeData.length; i += 1) {
          const normalized = (timeData[i] - 128) / 128;
          squareSum += normalized * normalized;
        }
        // Use the loudest active side instead of averaging local + remote.
        // Otherwise a silent Agent track can halve the user's wave amplitude
        // (and vice versa).
        peakRms = Math.max(peakRms, Math.sqrt(squareSum / timeData.length));
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);
        return frequencyData;
      });

      const rms = peakRms;
      const signal = Math.max(0, (rms - 0.012) / 0.12);
      const envelope = Math.min(1, Math.pow(signal, 0.58));

      setWaveLevels((previous) =>
        previous.map((oldLevel, index) => {
          if (envelope < 0.015) return oldLevel * 0.78;
          const distance = Math.abs(index - 15) / 15;
          const centerWeight = Math.max(0.22, 1 - distance * 0.7);
          const spectralPosition = Math.pow(distance, 0.72);
          let frequency = 0;
          let samples = 0;
          frequencyBuffers.forEach((data) => {
            const start = Math.floor(spectralPosition * data.length * 0.78);
            const end = Math.max(
              start + 1,
              Math.floor((spectralPosition + 0.045) * data.length * 0.78),
            );
            for (let i = start; i < Math.min(end, data.length); i += 1) {
              frequency += data[i];
              samples += 1;
            }
          });
          const spectralLevel = samples ? frequency / samples / 255 : 0;
          const target = Math.min(
            1,
            envelope *
              (0.58 + Math.pow(spectralLevel, 0.65) * 0.72) *
              centerWeight,
          );
          return target > oldLevel
            ? oldLevel * 0.36 + target * 0.64
            : oldLevel * 0.78 + target * 0.22;
        }),
      );
    };

    waveFrameRef.current = window.requestAnimationFrame(draw);
    return () => {
      if (waveFrameRef.current !== null) {
        window.cancelAnimationFrame(waveFrameRef.current);
        waveFrameRef.current = null;
      }
    };
  }, []);

  const startCall = useCallback(async () => {
    // Create/resume the AudioContext while we are still inside the user's
    // click gesture. Creating it only after the token/network awaits can leave
    // it suspended in browsers, which makes AnalyserNode report silence.
    void getAudioContext();

    setOpen(true);
    setView("call");
    setState("connecting");
    setError(null);
    setDuration(0);
    setCallStartedAt(null);
    setSpeakerOn(true);

    try {
      if (room.state !== "disconnected") await room.disconnect();

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("MICROPHONE_API_UNAVAILABLE");
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      if (!devices.some((d) => d.kind === "audioinput")) {
        throw new Error("MICROPHONE_NOT_FOUND");
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((t) => t.stop());
      } catch {
        throw new Error("MICROPHONE_PERMISSION_DENIED");
      }

      const identity = `browser-${crypto.randomUUID()}`;
      const res = await fetch(
        `/token?identity=${encodeURIComponent(identity)}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("VOICE_TOKEN_REQUEST_FAILED");

      const session = (await res.json()) as Partial<VoiceSession>;
      if (!session.token || !session.url)
        throw new Error("VOICE_SESSION_INVALID");

      await room.connect(session.url, session.token);
      await room.localParticipant.setMicrophoneEnabled(true);
      setMicEnabled(true);
      const localTrack = room.localParticipant.getTrackPublication(
        Track.Source.Microphone,
      )?.track;
      if (localTrack?.mediaStreamTrack)
        await setupTrackAnalyzer(localTrack.mediaStreamTrack, "local");
      setState("listening");
      setCallStartedAt(Date.now());
    } catch (cause) {
      console.error("Live voice connection failed", cause);
      await room.disconnect();
      setState("error");

      const code = cause instanceof Error ? cause.message : "";
      if (code === "MICROPHONE_NOT_FOUND") {
        setError(
          "هیچ میکروفونی متصل نیست. میکروفون را وصل کنید و دوباره تلاش کنید.",
        );
      } else if (code === "MICROPHONE_PERMISSION_DENIED") {
        setError("دسترسی به میکروفون داده نشده. مجوز مرورگر را فعال کنید.");
      } else if (code === "MICROPHONE_API_UNAVAILABLE") {
        setError("مرورگر از میکروفون پشتیبانی نمی‌کند.");
      } else {
        setError("مشکلی در برقراری تماس رخ داده است. لطفاً دوباره تلاش کنید.");
      }
    }
  }, [clearAnalyzers, getAudioContext, room, setupTrackAnalyzer]);

  const dismiss = useCallback(() => {
    setOpen(false);
    resetUi();
  }, [resetUi]);

  const retry = useCallback(async () => {
    await room.disconnect();
    await startCall();
  }, [room, startCall]);

  const toggleMicrophone = useCallback(async () => {
    const next = !micEnabled;
    try {
      await room.localParticipant.setMicrophoneEnabled(next);
      setMicEnabled(next);
      if (next) {
        const localTrack = room.localParticipant.getTrackPublication(
          Track.Source.Microphone,
        )?.track;
        if (localTrack?.mediaStreamTrack)
          await setupTrackAnalyzer(localTrack.mediaStreamTrack, "local");
      } else {
        removeAnalyzer("local");
      }
    } catch (err) {
      console.error("Failed to toggle microphone", err);
    }
  }, [micEnabled, removeAnalyzer, room, setupTrackAnalyzer]);

  const applySpeakerVolume = useCallback((on: boolean) => {
    const root = audioContainerRef.current ?? document.body;
    const audios = root.querySelectorAll("audio");
    audios.forEach((audio) => {
      audio.volume = on ? 1.0 : 0.3;
    });
  }, []);

  const toggleSpeaker = useCallback(() => {
    setSpeakerOn((prev) => {
      const next = !prev;
      requestAnimationFrame(() => applySpeakerVolume(next));
      return next;
    });
  }, [applySpeakerVolume]);

  useEffect(() => {
    if (!open) return;
    const first = window.setTimeout(() => applySpeakerVolume(speakerOn), 0);
    const second = window.setTimeout(() => applySpeakerVolume(speakerOn), 250);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, [open, speakerOn, applySpeakerVolume]);

  useEffect(() => {
    const onConnected = () => {
      setState("listening");
      setError(null);
    };
    const onDisconnected = () => {
      setRemoteSpeaking(false);
      setLocalSpeaking(false);
      setMicEnabled(true);
    };
    const onReconnecting = () => setState("reconnecting");
    const onReconnected = () => setState("listening");
    const onMediaDevicesError = () => {
      setState("error");
      setError("دسترسی به میکروفون ممکن نیست.");
    };
    const onActiveSpeakersChanged = (speakers: Array<{ identity: string }>) => {
      const localId = room.localParticipant.identity;
      const hasLocal = speakers.some((p) => p.identity === localId);
      const hasRemote = speakers.some((p) => p.identity !== localId);
      setLocalSpeaking(hasLocal);
      setRemoteSpeaking(hasRemote);
      if (hasRemote) setState("speaking");
      else if (room.state === "connected") setState("listening");
    };

    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.Reconnecting, onReconnecting);
    room.on(RoomEvent.Reconnected, onReconnected);
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    const onTrackSubscribed = (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: Participant,
    ) => {
      if (track.kind !== Track.Kind.Audio || !track.mediaStreamTrack) return;
      void setupTrackAnalyzer(
        track.mediaStreamTrack,
        `remote:${publication.trackSid || participant.identity}`,
      );
    };
    const onTrackUnsubscribed = (
      _track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: Participant,
    ) => {
      removeAnalyzer(`remote:${publication.trackSid || participant.identity}`);
    };

    room.on(RoomEvent.ActiveSpeakersChanged, onActiveSpeakersChanged);
    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);

    return () => {
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.Reconnecting, onReconnecting);
      room.off(RoomEvent.Reconnected, onReconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
      room.off(RoomEvent.ActiveSpeakersChanged, onActiveSpeakersChanged);
      room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      room.off(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
      clearAnalyzers();
      void room.disconnect();
    };
  }, [clearAnalyzers, removeAnalyzer, room, setupTrackAnalyzer]);

  useEffect(() => {
    if (!callStartedAt || view !== "call") return;
    const tick = () =>
      setDuration(Math.max(0, Math.floor((Date.now() - callStartedAt) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [callStartedAt, view]);

  const isConnected = room.state === "connected";
  const theme = getTheme(state, remoteSpeaking, localSpeaking);
  const statusText = getStatusText(state, remoteSpeaking, localSpeaking);
  const isSpeaking = remoteSpeaking || localSpeaking || state === "speaking";
  const showWave = state !== "error";
  const waveActive =
    isSpeaking || state === "listening" || state === "thinking";
  const showTimer =
    state === "listening" || isSpeaking || state === "connecting";

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="تماس صوتی"
        title="تماس صوتی"
        onClick={() => void startCall()}
        disabled={state === "connecting"}
        className="h-9 w-9 shrink-0 rounded-full p-0 text-text-secondary hover:bg-primary/10 hover:text-primary"
      >
        {state === "connecting" ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        )}
      </Button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <RoomContext.Provider value={room}>
            <div
              ref={audioContainerRef}
              dir="rtl"
              role="dialog"
              aria-modal="true"
              aria-label="تماس صوتی با صوت‌تیک"
              className="fixed inset-0 z-[100] flex flex-col overflow-hidden text-text backdrop-blur-xl"
              style={{ color: "var(--text)" }}
            >
              <style>{`
                .voice-wave {
                  isolation:isolate;
                  mask-image:linear-gradient(90deg,transparent 0%,#000 7%,#000 93%,transparent 100%);
                }
                .voice-wave__ambient {
                  position:absolute;
                  left:9%; right:9%; top:50%; height:42px; transform:translateY(-50%);
                  border-radius:999px;
                  background:radial-gradient(ellipse at center, color-mix(in srgb,var(--primary) 12%,transparent), transparent 68%);
                  filter:blur(16px); opacity:.5;
                }
                .voice-wave__baseline {
                  position:absolute; left:8%; right:8%; top:50%; height:1px;
                  background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--primary) 24%,transparent) 16%,color-mix(in srgb,var(--primary) 36%,transparent) 50%,color-mix(in srgb,var(--primary) 24%,transparent) 84%,transparent);
                  opacity:.65;
                }
                .voice-wave__reflection {
                  position:absolute; left:18%; right:18%; bottom:8px; height:9px;
                  border-radius:50%; background:radial-gradient(ellipse,color-mix(in srgb,var(--primary) 16%,transparent),transparent 70%);
                  filter:blur(7px); opacity:.35;
                }
                .voice-wave__bar {
                  position:relative; z-index:2; flex:0 0 auto; min-height:4px;
                  border-radius:999px;
                  background:linear-gradient(180deg, color-mix(in srgb,var(--primary) 38%,white 62%) 0%, var(--primary) 42%, color-mix(in srgb,var(--primary) 72%,#102810 28%) 100%);
                  transition:height .075s cubic-bezier(.22,.61,.36,1),opacity .12s ease,transform .075s ease,box-shadow .12s ease;
                  will-change:height,transform,opacity;
                }
                .voice-wave--active .voice-wave__bar { animation:voice-wave-shimmer 1.7s ease-in-out infinite alternate; }
                .voice-wave--idle .voice-wave__bar { filter:saturate(.82); }
                @keyframes voice-wave-shimmer { from { filter:brightness(.96); } to { filter:brightness(1.14); } }
                @media (prefers-reduced-motion:reduce) { .voice-wave--active .voice-wave__bar { animation:none; } }

                .voice-orb__bloom { position:absolute; inset:-18%; border-radius:50%; background:radial-gradient(circle at 50% 50%, color-mix(in srgb,var(--primary) 24%,transparent) 0 24%,transparent 64%),radial-gradient(circle at 50% 50%,color-mix(in srgb,var(--primary) 16%,transparent),transparent 70%); filter:blur(28px); opacity:.58; transform:scale(.92); transition:transform .8s cubic-bezier(.2,.8,.2,1),opacity .8s ease; animation:voice-orb-breathe 4.8s ease-in-out infinite; }
                .voice-orb__ring { position:absolute; border-radius:50%; pointer-events:none; transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s ease,box-shadow .7s ease; }
                .voice-orb__ring--outer { inset:2%; border:1px solid color-mix(in srgb,var(--primary) 38%,transparent); box-shadow:0 0 0 10px color-mix(in srgb,var(--primary) 3%,transparent),0 0 42px color-mix(in srgb,var(--primary) 13%,transparent); opacity:.7; }
                .voice-orb__ring--middle { inset:10%; border:1px solid color-mix(in srgb,var(--primary) 20%,var(--border) 55%); box-shadow:inset 0 0 26px color-mix(in srgb,var(--primary) 7%,transparent); opacity:.75; }
                .voice-orb__ring--inner { inset:18%; border:1px dashed color-mix(in srgb,var(--primary) 18%,var(--border) 42%); opacity:.55; }
                .voice-orb { position:relative; z-index:3; width:50%; height:50%; display:flex; align-items:center; justify-content:center; overflow:hidden; border-radius:50%; color:#fff; background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.46),transparent 20%),radial-gradient(circle at 68% 72%,color-mix(in srgb,var(--primary) 92%,#000 8%),transparent 62%),linear-gradient(145deg,color-mix(in srgb,var(--primary) 90%,white 10%),color-mix(in srgb,var(--background) 58%,var(--primary) 42%)); border:1px solid rgba(255,255,255,.18); box-shadow:inset 0 1px 2px rgba(255,255,255,.42),inset 0 -18px 34px rgba(0,0,0,.28),0 16px 42px rgba(0,0,0,.2),0 0 54px color-mix(in srgb,var(--primary) 24%,transparent); transform:scale(1); transition:transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .6s ease,filter .6s ease; animation:voice-orb-core-breathe 4.8s ease-in-out infinite; }
                .voice-orb::before { content:""; position:absolute; inset:6%; border-radius:50%; background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.2),transparent 34%); border:1px solid rgba(255,255,255,.08); opacity:.8; }
                .voice-orb::after { content:""; position:absolute; inset:-35%; border-radius:50%; background:conic-gradient(from 20deg,transparent,rgba(255,255,255,.18),transparent 22%,rgba(255,255,255,.08),transparent 46%); filter:blur(10px); animation:voice-orb-spin 8s linear infinite; }
                .voice-orb__core { position:absolute; width:31%; height:31%; border-radius:50%; background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.75),rgba(255,255,255,.12) 35%,transparent 70%); filter:blur(1px); opacity:.75; animation:voice-orb-glow 3.2s ease-in-out infinite; }
                .voice-orb__sheen { position:absolute; width:75%; height:34%; top:2%; left:-8%; border-radius:50%; background:rgba(255,255,255,.22); filter:blur(14px); transform:rotate(-18deg); }
                .voice-orb__particles { position:absolute; inset:0; z-index:2; pointer-events:none; }
                .voice-orb__particles i { position:absolute; width:3px; height:3px; border-radius:50%; background:rgba(255,255,255,.58); box-shadow:0 0 8px rgba(255,255,255,.45); opacity:.5; }
                .voice-orb__particles i:nth-child(1){left:24%;top:32%;animation:voice-orb-p1 3.2s ease-in-out infinite}.voice-orb__particles i:nth-child(2){right:25%;top:25%;animation:voice-orb-p2 4s ease-in-out infinite}.voice-orb__particles i:nth-child(3){right:22%;bottom:28%;animation:voice-orb-p3 3.6s ease-in-out infinite}.voice-orb__particles i:nth-child(4){left:28%;bottom:22%;animation:voice-orb-p4 4.4s ease-in-out infinite}
                .voice-orb span { position:relative; z-index:4; font-size:14px; font-weight:800; letter-spacing:-.2px; text-shadow:0 1px 8px rgba(0,0,0,.22); }
                .is-speaking .voice-orb__bloom { transform:scale(1.18); opacity:.9; }.is-speaking .voice-orb { transform:scale(1.075); filter:saturate(1.08); box-shadow:inset 0 1px 2px rgba(255,255,255,.48),inset 0 -18px 34px rgba(0,0,0,.24),0 18px 48px rgba(0,0,0,.22),0 0 78px color-mix(in srgb,var(--primary) 38%,transparent); }.is-speaking .voice-orb__ring--outer{transform:scale(1.09);opacity:.95;box-shadow:0 0 0 10px color-mix(in srgb,var(--primary) 5%,transparent),0 0 65px color-mix(in srgb,var(--primary) 24%,transparent)}.is-speaking .voice-orb__ring--middle{transform:scale(1.045)}
                .is-connecting .voice-orb__ring--outer { animation:voice-orb-pulse 1.25s ease-in-out infinite; }.is-connecting .voice-orb { animation:voice-orb-core-breathe 1.8s ease-in-out infinite; }.is-error .voice-orb { background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.32),transparent 24%),linear-gradient(145deg,var(--danger),color-mix(in srgb,var(--background) 70%,var(--danger) 30%)); }
                @keyframes voice-orb-breathe{0%,100%{transform:scale(.92);opacity:.48}50%{transform:scale(1.02);opacity:.68}} @keyframes voice-orb-core-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.018)}} @keyframes voice-orb-glow{0%,100%{transform:scale(.82);opacity:.52}50%{transform:scale(1.08);opacity:.86}} @keyframes voice-orb-spin{to{transform:rotate(360deg)}}
                @keyframes voice-orb-p1{0%,100%{transform:translate(0,0);opacity:.35}50%{transform:translate(7px,-5px);opacity:.8}} @keyframes voice-orb-p2{0%,100%{transform:translate(0,0);opacity:.35}50%{transform:translate(-6px,6px);opacity:.8}} @keyframes voice-orb-p3{0%,100%{transform:translate(0,0);opacity:.3}50%{transform:translate(-5px,-7px);opacity:.75}} @keyframes voice-orb-p4{0%,100%{transform:translate(0,0);opacity:.35}50%{transform:translate(6px,5px);opacity:.78}} @keyframes voice-orb-pulse{0%,100%{transform:scale(1);opacity:.65}50%{transform:scale(1.08);opacity:1}}
              `}</style>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "var(--background)",
                  opacity: -1,
                }}
              />
              <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                <RoomAudioRenderer />

                {/* Ambient */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div
                    className={`absolute left-1/2 top-[32%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] transition-all duration-1000 ease-out ${theme.ambient} ${
                      isSpeaking
                        ? "scale-130 opacity-100"
                        : "scale-100 opacity-60"
                    }`}
                  />
                </div>

                {/* Header */}
                <header className="relative z-10 flex shrink-0 items-center justify-center px-6 pt-12 sm:pt-14">
                  <div className="text-center">
                    <div className="text-[17px] font-semibold tracking-tight text-text">
                      دستیار هوشمند بانک کشاورزی
                    </div>
                    {(state === "connecting" || state === "reconnecting") && (
                      <div className="mt-1 text-[13px] text-text-muted">
                        {state === "reconnecting"
                          ? "در حال اتصال مجدد..."
                          : "در حال اتصال..."}
                      </div>
                    )}
                  </div>
                </header>

                {view === "ended" ? (
                  <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
                    <div className="relative flex h-32 w-32 items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]" />
                      <div className="absolute inset-5 rounded-full border border-white/5" />
                      <span className="relative text-sm font-semibold tracking-tight text-text-secondary">
                        صوت‌تیک
                      </span>
                    </div>
                    <div className="mt-8 text-center">
                      <div className="text-[17px] font-medium text-text">
                        تماس پایان یافت
                      </div>
                      <div className="mt-1.5 font-mono text-[15px] tabular-nums text-text-muted">
                        {formatDuration(duration)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={dismiss}
                      className="mt-12 flex h-12 items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--border)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] px-7 text-[15px] font-medium text-text shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition duration-200 hover:bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] active:scale-95"
                    >
                      <RotateCcw className="h-4 w-4" />
                      بازگشت به گفتگو
                    </button>
                  </div>
                ) : (
                  <main className="relative z-10 flex flex-1 flex-col items-center justify-between px-6 pb-14 pt-6">
                    <div className="flex flex-1 flex-col items-center justify-center">
                      {/* Status */}
                      <div className="mb-9 flex items-center gap-2 text-[13px] text-text-secondary">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${theme.dot}`}
                        />
                        <span>
                          {state === "error"
                            ? "خطا در اتصال"
                            : state === "connecting" || state === "reconnecting"
                              ? "در حال اتصال..."
                              : "متصل"}
                        </span>
                      </div>

                      {/* Premium Orb – same visual language as the standalone Widget */}
                      <div
                        className={`relative my-[18px] flex aspect-square w-[min(62vw,300px)] items-center justify-center [isolation:isolate] ${
                          isSpeaking ? "is-speaking" : ""
                        } ${state === "connecting" || state === "reconnecting" ? "is-connecting" : ""} ${state === "error" ? "is-error" : ""}`}
                      >
                        <div className="voice-orb__bloom" />
                        <div className="voice-orb__ring voice-orb__ring--outer" />
                        <div className="voice-orb__ring voice-orb__ring--middle" />
                        <div className="voice-orb__ring voice-orb__ring--inner" />
                        <div className="voice-orb">
                          <div className="voice-orb__core" />
                          <div className="voice-orb__sheen" />
                          <div className="voice-orb__particles">
                            <i />
                            <i />
                            <i />
                            <i />
                          </div>
                          <span>صوت‌تیک</span>
                        </div>
                      </div>

                      {/* Wave + status */}
                      <div className="mt-10 flex min-h-[92px] flex-col items-center">
                        {showWave && (
                          <div className="mb-3">
                            <VoiceWave
                              levels={waveLevels}
                              active={waveActive}
                              colorClass={theme.wave}
                            />
                          </div>
                        )}

                        <div className="text-[14px] text-text-secondary">
                          {statusText}
                        </div>

                        {showTimer && (
                          <div className="mt-1.5 font-mono text-[14px] tabular-nums tracking-wide text-text-muted">
                            {formatDuration(duration)}
                          </div>
                        )}

                        {state === "error" && error && (
                          <p className="mt-4 max-w-[240px] text-center text-[13px] leading-5 text-danger/80">
                            {error}
                          </p>
                        )}

                        {(state === "connecting" ||
                          state === "reconnecting") && (
                          <div className="mt-5 flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70"
                                style={{ animationDelay: `${i * 150}ms` }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex w-full max-w-[300px] flex-col items-center">
                      {state === "error" ? (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => void retry()}
                            className="flex h-12 items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--border)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] px-6 text-[15px] font-medium text-text shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-2xl transition duration-200 hover:bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] active:scale-95"
                          >
                            <RotateCcw className="h-4 w-4" />
                            تلاش مجدد
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              dismiss();
                              router.push("/");
                            }}
                            className="flex h-12 items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--border)_72%,transparent)] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)] px-6 text-[15px] font-medium text-text-secondary shadow-[0_8px_30px_rgba(0,0,0,0.07)] backdrop-blur-2xl transition duration-200 hover:text-text active:scale-95"
                          >
                            صفحه اصلی
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-8">
                          <button
                            type="button"
                            aria-label={
                              micEnabled
                                ? "بی‌صدا کردن میکروفون"
                                : "فعال کردن میکروفون"
                            }
                            onClick={() => void toggleMicrophone()}
                            disabled={!isConnected}
                            className={`flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--border)_72%,transparent)] shadow-[0_10px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition duration-200 hover:scale-[1.03] active:scale-95 ${
                              micEnabled
                                ? "bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] text-text"
                                : "bg-primary text-primary-foreground"
                            } disabled:opacity-30`}
                          >
                            {micEnabled ? (
                              <Mic className="h-6 w-6" strokeWidth={1.8} />
                            ) : (
                              <MicOff className="h-6 w-6" strokeWidth={1.8} />
                            )}
                          </button>

                          <button
                            type="button"
                            aria-label="پایان تماس"
                            onClick={() => void disconnect(true)}
                            disabled={!isConnected && state !== "connecting"}
                            className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-danger text-white shadow-[0_8px_28px_color-mix(in_srgb,var(--danger)_34%,transparent)] transition-all duration-200 hover:scale-[1.03] active:scale-90 disabled:opacity-40"
                          >
                            <PhoneOff
                              className="h-[26px] w-[26px]"
                              strokeWidth={1.7}
                            />
                          </button>

                          <button
                            type="button"
                            aria-label={
                              speakerOn
                                ? "خاموش کردن بلندگو"
                                : "روشن کردن بلندگو"
                            }
                            onClick={toggleSpeaker}
                            disabled={!isConnected}
                            className={`flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--border)_72%,transparent)] shadow-[0_10px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition duration-200 hover:scale-[1.03] active:scale-95 ${
                              speakerOn
                                ? "bg-primary text-primary-foreground"
                                : "bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] text-text"
                            } disabled:opacity-30`}
                          >
                            {speakerOn ? (
                              <Volume2 className="h-6 w-6" strokeWidth={1.8} />
                            ) : (
                              <VolumeX className="h-6 w-6" strokeWidth={1.8} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </main>
                )}
              </div>
            </div>
          </RoomContext.Provider>,
          document.body,
        )}
    </>
  );
}
