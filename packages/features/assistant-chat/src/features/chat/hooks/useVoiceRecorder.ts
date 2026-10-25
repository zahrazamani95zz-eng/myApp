"use client";

import { useEffect, useRef, useState } from "react";

export function useVoiceRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const [duration, setDuration] = useState(0);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const cancelledRef = useRef(false);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);

    recorderRef.current = recorder;

    chunksRef.current = [];
    cancelledRef.current = false;

    setDuration(0);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      if (cancelledRef.current) return;
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    recorder.start();

    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  }

  function stopRecording(): Promise<Blob | null> {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return Promise.resolve(audioBlob);
    }

    return new Promise((resolve) => {
      cancelledRef.current = false;
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        recorderRef.current = null;
        resolve(blob);
      };

      recorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setIsRecording(false);
    });
  }

  function cancelRecording() {
    cancelledRef.current = true;
    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    recorder?.stream.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;

    setAudioBlob(null);
    chunksRef.current = [];
    setDuration(0);
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      recorder?.stream.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
    };
  }, []);

  return {
    isRecording,
    duration,
    audioBlob,

    startRecording,
    stopRecording,
    cancelRecording,
  };
}
