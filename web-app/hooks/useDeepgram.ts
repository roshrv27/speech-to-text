"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface UseDeepgramOptions {
  language: string;
}

interface UseDeepgramReturn {
  isListening: boolean;
  transcript: string;
  interimText: string;
  error: string | null;
  stream: MediaStream | null;
  start: () => Promise<void>;
  stop: () => void;
  clear: () => void;
}

export function useDeepgram({ language }: UseDeepgramOptions): UseDeepgramReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setStream(null);
    setInterimText("");
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      
      const res = await fetch("/api/deepgram-token");
      const { key } = await res.json();
      if (!key) throw new Error("Failed to get Deepgram token");

      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = mediaStream;
      setStream(mediaStream);

      const params = new URLSearchParams({
        model: "nova-3",
        language: language,
        punctuate: "true",
        interim_results: "true",
        smart_format: "true",
      });
      const wsUrl = `wss://api.deepgram.com/v1/listen?${params.toString()}`;

      const ws = new WebSocket(wsUrl, ["token", key]);
      wsRef.current = ws;

      ws.onopen = () => {
        const mediaRecorder = new MediaRecorder(mediaStream, {
          mimeType: "audio/webm;codecs=opus",
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };

        mediaRecorder.start(250);
        setIsListening(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const text = data.channel?.alternatives?.[0]?.transcript || "";

          if (text.trim()) {
            if (data.is_final) {
              setTranscript((prev) => prev + (prev ? " " : "") + text);
              setInterimText("");
            } else {
              setInterimText(text);
            }
          }
        } catch (e) {
          console.error("Failed to parse Deepgram message:", e);
        }
      };

      ws.onerror = () => {
        setError("WebSocket connection error");
        stop();
      };

      ws.onclose = () => {
        setIsListening(false);
      };
    } catch (err) {
      console.error("Failed to start transcription:", err);
      setError(err instanceof Error ? err.message : "Failed to start");
      setIsListening(false);
    }
  }, [language, stop]);

  const clear = useCallback(() => {
    setTranscript("");
    setInterimText("");
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { isListening, transcript, interimText, error, stream, start, stop, clear };
}
