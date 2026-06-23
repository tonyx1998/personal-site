"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, PhoneOff, Loader2 } from "lucide-react";

type Status = "idle" | "connecting" | "live" | "error";

const CALLS_URL = "https://api.openai.com/v1/realtime/calls";

// Optional Cloudflare Turnstile — only active when a site key is configured.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "auto" | "light" | "dark";
    }
  ) => string;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function VoiceDemo() {
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);

  // Load and render the Turnstile widget when a site key is present.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const renderWidget = () => {
      const api = window.turnstile;
      const el = turnstileRef.current;
      if (api && el && !el.hasChildNodes()) {
        api.render(el, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(null),
          "error-callback": () => setTurnstileToken(null),
          theme: "auto",
        });
      }
    };

    const SCRIPT_ID = "cf-turnstile-script";
    if (document.getElementById(SCRIPT_ID)) {
      renderWidget();
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.head.appendChild(script);
  }, []);

  const cleanup = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setStatus("idle");
  }, [cleanup]);

  const start = useCallback(async () => {
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMsg("Please complete the verification below first.");
      setStatus("error");
      return;
    }

    setStatus("connecting");
    setTranscript("");
    setErrorMsg("");

    try {
      // 1. Get an ephemeral token from our own server.
      const sessionRes = await fetch("/api/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turnstileToken }),
      });
      if (!sessionRes.ok) {
        setErrorMsg(
          sessionRes.status === 503
            ? "The live demo isn't enabled right now."
            : sessionRes.status === 429
              ? "Demo limit reached — please try again later. (It's a live, paid API, so usage is capped.)"
              : sessionRes.status === 403
                ? "Verification failed. Please refresh and try again."
                : "Couldn't start a session. Please try again."
        );
        setStatus("error");
        return;
      }
      const { token } = (await sessionRes.json()) as { token: string };

      // 2. Mic capture (user gesture already happened via the button click).
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Peer connection: send mic, play model audio.
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (e) => {
        if (audioRef.current) {
          audioRef.current.srcObject = e.streams[0];
          void audioRef.current.play().catch(() => {});
        }
      };
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 4. Data channel for live events (assistant transcript captions).
      const channel = pc.createDataChannel("oai-events");
      channel.addEventListener("message", (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (
            typeof msg.type === "string" &&
            msg.type.includes("transcript") &&
            typeof msg.delta === "string"
          ) {
            setTranscript((prev) => prev + msg.delta);
          }
          if (msg.type === "response.done")
            setTranscript((prev) => prev + "\n");
        } catch {
          /* ignore non-JSON frames */
        }
      });
      pc.addEventListener("connectionstatechange", () => {
        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          setErrorMsg("Connection lost.");
          setStatus("error");
          cleanup();
        }
      });

      // 5. SDP offer → OpenAI → answer.
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(CALLS_URL, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/sdp",
        },
      });
      if (!sdpRes.ok) {
        setErrorMsg("The model declined the connection.");
        setStatus("error");
        cleanup();
        return;
      }

      const answer = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answer });
      setStatus("live");
    } catch (err) {
      setErrorMsg(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone permission was denied."
          : "Something went wrong starting the demo."
      );
      setStatus("error");
      cleanup();
    }
  }, [cleanup, turnstileToken]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <audio ref={audioRef} className="hidden" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            Talk to my realtime voice agent
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            A live, in-browser demo of the OpenAI Realtime API over WebRTC — the
            same stack behind my voice-tutor work. Click, allow your mic, and
            just talk.
          </p>
        </div>

        {status === "live" ? (
          <button
            onClick={stop}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-red-500/90 text-white font-medium hover:bg-red-500 transition-colors"
          >
            <PhoneOff size={18} />
            End
          </button>
        ) : (
          <button
            onClick={start}
            disabled={status === "connecting"}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {status === "connecting" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <Mic size={18} />
                Start talking
              </>
            )}
          </button>
        )}
      </div>

      {/* Cloudflare Turnstile — rendered only when a site key is configured. */}
      {TURNSTILE_SITE_KEY && status !== "live" && (
        <div ref={turnstileRef} className="mt-5" />
      )}

      {status === "live" && (
        <div className="mt-5 flex items-center gap-2 text-sm text-green-500 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          listening — say hello
        </div>
      )}

      {transcript && (
        <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border-l-2 border-accent/40 pl-3">
          {transcript}
        </p>
      )}

      {status === "error" && (
        <p className="mt-4 text-sm text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
