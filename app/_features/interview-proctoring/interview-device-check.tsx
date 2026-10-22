"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiAlertTriangle,
  FiCamera,
  FiCheckCircle,
  FiLoader,
  FiLock,
  FiMic,
  FiShield,
  FiVolume2,
} from "react-icons/fi";
import { recordBrowserIntegrityEvent } from "./integrity-api";

type DeviceCheckProps = {
  onReadyChange: (ready: boolean) => void;
};

type FaceMonitorProps = {
  interviewType: "coding" | "mcq";
  sessionId: string;
  token: string;
  websocketBaseUrl: string;
  onViolationCount?: (count: number) => void;
};

type CheckState = "idle" | "checking" | "ready" | "error";
type MonitorState = "connecting" | "verified" | "warning" | "offline";

const integrityRules = [
  "Stay on this interview tab and keep it in fullscreen mode.",
  "Do not open another tab, window, application, or virtual assistant.",
  "Copy, cut, paste, right-click, printing, saving, and developer tools are disabled.",
  "Screenshots, screen recording, phones, books, and help from another person are prohibited.",
];

export function InterviewIntegrityChecklist() {
  return (
    <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
      <div className="flex items-center gap-2 font-bold"><FiShield aria-hidden /> Interview integrity rules</div>
      <ul className="mt-3 space-y-2 pl-5 text-sm leading-5">
        {integrityRules.map((rule) => <li className="list-disc" key={rule}>{rule}</li>)}
      </ul>
      <p className="mt-3 text-xs leading-5 text-amber-800">Leaving the interview or attempting a restricted action is counted as a violation.</p>
    </section>
  );
}

export function InterviewSecurityGuard({ interviewType, sessionId, token }: { interviewType: "mcq" | "coding"; sessionId: string; token: string }) {
  const [locked, setLocked] = useState(true);
  const [reason, setReason] = useState("Enter fullscreen to begin the secured interview.");
  const [violations, setViolations] = useState(0);
  const lastViolationRef = useRef(0);
  const fullscreenSupported = typeof document !== "undefined" && Boolean(document.documentElement.requestFullscreen);

  const recordViolation = useCallback((message: string) => {
    const now = Date.now();
    if (now - lastViolationRef.current < 800) return;
    lastViolationRef.current = now;
    setViolations((count) => count + 1);
    setReason(message);
    setLocked(true);
    void recordBrowserIntegrityEvent(interviewType, sessionId, token, "browser_restriction_triggered", { message }).catch(() => undefined);
  }, [interviewType, sessionId, token]);

  useEffect(() => {
    const handleContextMenu = (event: Event) => {
      event.preventDefault();
      recordViolation("Right-click is disabled during this interview.");
    };
    const handleClipboard = (event: Event) => {
      event.preventDefault();
      recordViolation("Copy, cut, and paste are disabled during this interview.");
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      const restricted =
        event.key === "PrintScreen" ||
        event.key === "F12" ||
        (modifier && ["c", "x", "v", "p", "s", "u"].includes(key)) ||
        (modifier && event.shiftKey && ["i", "j", "c"].includes(key));
      if (!restricted) return;
      event.preventDefault();
      event.stopPropagation();
      recordViolation(event.key === "PrintScreen" ? "A screenshot attempt was detected." : "That keyboard shortcut is disabled during this interview.");
    };
    const handleVisibility = () => {
      if (document.hidden) recordViolation("You left the interview tab. Return to fullscreen to continue.");
    };
    const handleBlur = () => recordViolation("The interview window lost focus. Other tabs and applications are not allowed.");
    const handleFullscreen = () => {
      if (fullscreenSupported && !document.fullscreenElement) recordViolation("Fullscreen mode was exited. Re-enter fullscreen to continue.");
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleClipboard);
    document.addEventListener("cut", handleClipboard);
    document.addEventListener("paste", handleClipboard);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreen);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleClipboard);
      document.removeEventListener("cut", handleClipboard);
      document.removeEventListener("paste", handleClipboard);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreen);
      window.removeEventListener("blur", handleBlur);
    };
  }, [fullscreenSupported, recordViolation]);

  async function resume() {
    try {
      if (fullscreenSupported && !document.fullscreenElement) await document.documentElement.requestFullscreen();
      setLocked(false);
      setReason("");
    } catch {
      setReason("Fullscreen permission was denied. Allow fullscreen mode to continue.");
    }
  }

  if (!locked) {
    return violations ? <div className="fixed left-3 top-20 z-40 rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 shadow-lg" aria-live="polite">Integrity violations: {violations}</div> : null;
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="security-lock-title">
      <section className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700"><FiLock className="h-6 w-6" aria-hidden /></span>
        <h2 className="mt-5 text-2xl font-bold text-slate-950" id="security-lock-title">Interview paused</h2>
        <p className="mt-2 leading-6 text-slate-600">{reason}</p>
        <InterviewIntegrityChecklist />
        {violations > 0 ? <p className="mt-4 text-sm font-bold text-rose-700">Recorded violations: {violations}</p> : null}
        <button autoFocus className="mt-5 min-h-12 w-full rounded-xl bg-blue-600 px-5 font-semibold text-white outline-offset-2 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700" onClick={() => void resume()} type="button">
          {fullscreenSupported ? "Enter fullscreen and continue" : "Acknowledge and continue"}
        </button>
      </section>
    </div>
  );
}

export function InterviewDeviceCheck({ onReadyChange }: DeviceCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const voiceDetectorRef = useRef<{ destroy: () => Promise<void> } | null>(null);
  const animationRef = useRef<number | null>(null);
  const [state, setState] = useState<CheckState>("idle");
  const [message, setMessage] = useState("Run the check before joining your interview.");
  const [audioLevel, setAudioLevel] = useState(0);

  const stopMedia = useCallback(() => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    if (voiceDetectorRef.current) void voiceDetectorRef.current.destroy();
    voiceDetectorRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioContextRef.current) void audioContextRef.current.close();
    audioContextRef.current = null;
  }, []);

  useEffect(() => stopMedia, [stopMedia]);

  async function runCheck() {
    stopMedia();
    onReadyChange(false);
    setState("checking");
    setMessage("Requesting camera and microphone access…");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("This browser does not support camera and microphone checks.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(samples);
        const average = samples.reduce((sum, value) => sum + value, 0) / samples.length;
        setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      const cameraReady = stream.getVideoTracks().some((track) => track.readyState === "live");
      const microphoneReady = stream.getAudioTracks().some((track) => track.readyState === "live");
      if (!cameraReady || !microphoneReady) throw new Error("Camera and microphone must both be available.");

      setMessage("Say ‘microphone test’ clearly to verify live speech detection.");
      const audioTrack = stream.getAudioTracks()[0];
      const { MicVAD } = await import("@ricky0123/vad-web");
      let resolveSpeechTest: (detected: boolean) => void = () => undefined;
      const speechTest = new Promise<boolean>((resolve) => { resolveSpeechTest = resolve; });
      const detector = await MicVAD.new({
        model: "v5",
        baseAssetPath: "/vad/",
        onnxWASMBasePath: "/vad/",
        audioContext,
        processorType: "AudioWorklet",
        startOnLoad: false,
        positiveSpeechThreshold: 0.38,
        negativeSpeechThreshold: 0.23,
        minSpeechMs: 450,
        redemptionMs: 700,
        preSpeechPadMs: 250,
        getStream: async () => new MediaStream([audioTrack]),
        pauseStream: async () => undefined,
        resumeStream: async () => new MediaStream([audioTrack]),
        onSpeechRealStart: () => resolveSpeechTest(true),
      });
      voiceDetectorRef.current = detector;
      await detector.start();
      const speechTimeout = window.setTimeout(() => resolveSpeechTest(false), 15_000);
      const speechDetected = await speechTest;
      window.clearTimeout(speechTimeout);
      await detector.destroy();
      if (voiceDetectorRef.current === detector) voiceDetectorRef.current = null;
      if (!speechDetected) throw new Error("No speech was detected. Check the selected microphone in your browser, then run the system check again and speak clearly.");

      setState("ready");
      setMessage("Camera, microphone, and live speech detection are ready. Keep this tab open until the interview starts.");
      onReadyChange(true);
    } catch (error) {
      stopMedia();
      setState("error");
      setMessage(deviceErrorMessage(error));
      onReadyChange(false);
    }
  }

  function playSpeakerTest() {
    const context = audioContextRef.current ?? new AudioContext();
    if (!audioContextRef.current) audioContextRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 523.25;
    gain.gain.setValueAtTime(0.12, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.45);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.45);
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-live="polite">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-950">System compatibility check</h2>
          <p className="mt-1 text-sm leading-5 text-slate-600">Available from your interview link up to 30 minutes before the scheduled start.</p>
        </div>
        <StatusIcon state={state} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]">
        <div className="aspect-video overflow-hidden rounded-xl bg-slate-950">
          <video aria-label="Camera preview" className="h-full w-full object-cover [transform:scaleX(-1)]" muted playsInline ref={videoRef} />
        </div>
        <div>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <CheckItem icon={<FiCamera />} label="Camera" ready={state === "ready"} />
            <CheckItem icon={<FiMic />} label="Microphone" ready={state === "ready"} />
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200" aria-label={`Microphone level ${audioLevel}%`}>
            <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${audioLevel}%` }} />
          </div>
          <p className={`mt-3 text-xs leading-5 ${state === "error" ? "text-rose-700" : "text-slate-600"}`}>{message}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50" disabled={state === "checking"} onClick={() => void runCheck()} type="button">
          {state === "checking" ? <FiLoader className="animate-spin" aria-hidden /> : <FiCamera aria-hidden />}
          {state === "ready" ? "Run check again" : "Run system check"}
        </button>
        <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-100" onClick={playSpeakerTest} type="button">
          <FiVolume2 aria-hidden /> Test speaker
        </button>
      </div>
    </section>
  );
}

export function InterviewFaceMonitor({ interviewType, sessionId, token, websocketBaseUrl, onViolationCount }: FaceMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<MonitorState>("connecting");
  const [message, setMessage] = useState("Starting identity monitoring…");
  const [noiseWarning, setNoiseWarning] = useState("");
  const [livenessPrompt, setLivenessPrompt] = useState("");

  useEffect(() => {
    let active = true;
    let captureTimer: number | undefined;
    let reconnectTimer: number | undefined;
    let stream: MediaStream | undefined;
    let audioContext: AudioContext | undefined;
    let voiceDetector: { start: () => Promise<void>; destroy: () => Promise<void> } | undefined;
    let noiseTimer: number | undefined;
    let noiseClearTimer: number | undefined;
    let socket: WebSocket | undefined;
    let awaitingResult = false;
    let challengeActive = false;
    let reconnectAttempt = 0;
    let lastNoiseViolationAt = 0;
    let silentInputSince = 0;
    let speechActive = false;
    let microphoneStartedAt = 0;
    let roomFloorRms = 0;
    let latestSpeechProbability = 0;
    let maximumSpeechProbability = 0;
    let processedSpeechFrames = 0;
    let monitorDiagnosticsSent = false;
    const roomFloorSamples: number[] = [];
    const loudMediaEvidence: number[] = [];

    const clearAudioWarningSoon = () => {
      if (noiseClearTimer !== undefined) return;
      noiseClearTimer = window.setTimeout(() => {
        noiseClearTimer = undefined;
        if (active && !speechActive) setNoiseWarning("");
      }, 1_500);
    };

    const reportDetectedAudio = (detector: "speech_model" | "loud_media", details: Record<string, unknown> = {}) => {
      if (!active) return;
      setNoiseWarning("Speech or media audio detected. Stop talking and mute nearby devices.");
      if (noiseClearTimer !== undefined) {
        window.clearTimeout(noiseClearTimer);
        noiseClearTimer = undefined;
      }
      const now = Date.now();
      if (now - lastNoiseViolationAt < 15_000) return;
      lastNoiseViolationAt = now;
      void recordBrowserIntegrityEvent(interviewType, sessionId, token, "ambient_noise_detected", {
        detector,
        ...details,
      }).then((result) => onViolationCount?.(result.violationCount)).catch(() => undefined);
    };

    const resumeMicrophoneMonitoring = () => {
      if (audioContext?.state === "suspended") {
        void audioContext.resume().then(() => setNoiseWarning("")).catch(() => undefined);
      }
    };

    const clearCaptureTimer = () => {
      if (captureTimer !== undefined) window.clearInterval(captureTimer);
      captureTimer = undefined;
    };

    const scheduleCaptures = () => {
      clearCaptureTimer();
      captureTimer = window.setInterval(capture, challengeActive ? 400 : 2_000);
    };

    const capture = () => {
      if (!active || !socket || socket.readyState !== WebSocket.OPEN || awaitingResult || socket.bufferedAmount > 256_000 || !videoRef.current) return;
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 640 / video.videoWidth);
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob || !socket || socket.readyState !== WebSocket.OPEN) return;
        awaitingResult = true;
        socket.send(blob);
      }, "image/jpeg", 0.72);
    };

    const connect = () => {
      if (!active || !navigator.onLine) {
        setState("offline");
        setMessage("You are offline. Identity monitoring will reconnect automatically.");
        return;
      }

      setState("connecting");
      setMessage(reconnectAttempt ? "Reconnecting identity monitor…" : "Connecting identity monitor…");
      const wsBase = websocketBaseUrl.replace(/\/$/, "");
      socket = new WebSocket(`${wsBase}/api/${interviewType === "mcq" ? "mcq-interviews" : "coding-interviews"}/sessions/${encodeURIComponent(sessionId)}/face-stream?token=${encodeURIComponent(token)}`);

      socket.addEventListener("open", () => {
        if (!active) return;
        reconnectAttempt = 0;
        awaitingResult = false;
        setState("connecting");
        setMessage("Identity monitor connected. First check is running…");
        window.setTimeout(capture, 750);
        scheduleCaptures();
      });
      socket.addEventListener("message", (event) => {
        awaitingResult = false;
        const payload = safeJson(event.data);
        if (!payload) return;
        if (payload.success && payload.type === "verification") {
          if (challengeActive) {
            challengeActive = false;
            scheduleCaptures();
          }
          setState("verified");
          setMessage("Identity verified. Keep your face visible.");
          setLivenessPrompt("");
        } else if (payload.success && payload.type === "liveness_required") {
          if (!challengeActive) {
            challengeActive = true;
            scheduleCaptures();
          }
          setState("connecting");
          const prompt = payload.message ?? "Perform the requested live action now.";
          setMessage("Random live identity check in progress");
          setLivenessPrompt(prompt);
        } else if (payload.type === "warning" || payload.success === false) {
          if (challengeActive) {
            challengeActive = false;
            scheduleCaptures();
          }
          setState("warning");
          setMessage(friendlyMonitorMessage(payload.message ?? payload.error?.message));
          setLivenessPrompt("");
          if (typeof payload.data?.violationCount === "number") onViolationCount?.(payload.data.violationCount);
        }
      });
      socket.addEventListener("close", (event) => {
        clearCaptureTimer();
        awaitingResult = false;
        if (!active || event.code === 1000) return;
        const retryDelay = Math.min(30_000, 2_000 * 2 ** reconnectAttempt);
        reconnectAttempt += 1;
        setState("offline");
        setMessage(`Identity monitor disconnected. Reconnecting in ${Math.ceil(retryDelay / 1000)} seconds…`);
        reconnectTimer = window.setTimeout(connect, retryDelay);
      });
      socket.addEventListener("error", () => {
        if (!active) return;
        setState("offline");
        setMessage("Identity monitoring connection failed. Reconnecting…");
      });
    };

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
          audio: { channelCount: 1, echoCancellation: false, noiseSuppression: true, autoGainControl: true },
        });
        if (!active) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          audioContext = new AudioContext();
          if (audioContext.state === "suspended") await audioContext.resume().catch(() => undefined);
          const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;
          analyser.smoothingTimeConstant = 0.55;
          source.connect(analyser);
          const samples = new Float32Array(analyser.fftSize);
          const handleMicrophoneEnded = () => {
            setNoiseWarning("Microphone disconnected. Reconnect it to continue monitoring.");
          };
          audioTrack.addEventListener("ended", handleMicrophoneEnded);
          microphoneStartedAt = Date.now();

          setNoiseWarning("Starting speech monitoring…");
          void (async () => {
            try {
              const { MicVAD } = await import("@ricky0123/vad-web");
              if (!active || !audioContext) return;
              voiceDetector = await MicVAD.new({
                model: "v5",
                baseAssetPath: "/vad/",
                onnxWASMBasePath: "/vad/",
                audioContext,
                processorType: "AudioWorklet",
                startOnLoad: false,
                positiveSpeechThreshold: 0.38,
                negativeSpeechThreshold: 0.23,
                minSpeechMs: 450,
                redemptionMs: 700,
                preSpeechPadMs: 250,
                getStream: async () => new MediaStream([audioTrack]),
                pauseStream: async () => undefined,
                resumeStream: async () => new MediaStream([audioTrack]),
                onFrameProcessed: (probabilities) => {
                  latestSpeechProbability = probabilities.isSpeech;
                  maximumSpeechProbability = Math.max(maximumSpeechProbability, probabilities.isSpeech);
                  processedSpeechFrames += 1;
                  if (!monitorDiagnosticsSent && processedSpeechFrames >= 100) {
                    monitorDiagnosticsSent = true;
                    const settings = audioTrack.getSettings();
                    void recordBrowserIntegrityEvent(interviewType, sessionId, token, "microphone_monitor_ready", {
                      detector: "silero_v5",
                      processedFrames: processedSpeechFrames,
                      maximumSpeechProbability: Number(maximumSpeechProbability.toFixed(4)),
                      sampleRate: settings.sampleRate,
                      channelCount: settings.channelCount,
                      noiseSuppression: settings.noiseSuppression,
                      autoGainControl: settings.autoGainControl,
                    }, "info").catch(() => undefined);
                  }
                },
                onSpeechStart: () => undefined,
                onSpeechRealStart: () => {
                  speechActive = true;
                  reportDetectedAudio("speech_model", { speechProbability: Number(latestSpeechProbability.toFixed(4)) });
                },
                onSpeechEnd: (audio) => {
                  speechActive = false;
                  clearAudioWarningSoon();
                  if (audio.length / 16_000 >= 1.2) {
                    reportDetectedAudio("speech_model", { segmentDurationSeconds: Number((audio.length / 16_000).toFixed(2)) });
                    clearAudioWarningSoon();
                  }
                },
                onVADMisfire: () => {
                  speechActive = false;
                  clearAudioWarningSoon();
                },
              });
              if (!active) {
                await voiceDetector.destroy();
                voiceDetector = undefined;
                return;
              }
              await voiceDetector.start();
              if (active) setNoiseWarning("");
            } catch {
              if (active) setNoiseWarning("Speech monitoring could not start. Refresh the interview before continuing.");
            }
          })();

          noiseTimer = window.setInterval(() => {
            if (!active) return;
            if (audioContext?.state !== "running") {
              setNoiseWarning("Microphone monitoring paused. Click anywhere on the interview to resume it.");
              return;
            }
            analyser.getFloatTimeDomainData(samples);
            const rms = Math.sqrt(samples.reduce((sum, value) => {
              return sum + value * value;
            }, 0) / samples.length);
            const peak = samples.reduce((largest, value) => Math.max(largest, Math.abs(value)), 0);
            const now = Date.now();

            if (rms < 0.0005 && peak < 0.002) {
              if (!silentInputSince) silentInputSince = now;
              if (now - silentInputSince >= 4_000) {
                setNoiseWarning("No microphone input is being received. Check that the correct microphone is selected and unmuted.");
              }
              return;
            }
            silentInputSince = 0;

            // Let hardware gain settle, then use the median room level as an
            // independent detector for music and other non-speech media.
            if (now - microphoneStartedAt < 8_000) {
              roomFloorSamples.push(rms);
              return;
            }
            if (!roomFloorRms) roomFloorRms = percentile(roomFloorSamples.slice(-20), 0.5);

            const loudMedia = rms >= Math.max(0.018, roomFloorRms * 2.1)
              || peak >= Math.max(0.12, roomFloorRms * 7);
            loudMediaEvidence.push(loudMedia ? 1 : 0);
            if (loudMediaEvidence.length > 16) loudMediaEvidence.shift();
            const loudFrames = loudMediaEvidence.reduce((sum, value) => sum + value, 0);
            if (!speechActive && loudFrames >= 4) {
              reportDetectedAudio("loud_media", {
                rms: Number(rms.toFixed(4)),
                peak: Number(peak.toFixed(4)),
                roomFloorRms: Number(roomFloorRms.toFixed(4)),
                evidenceFrames: loudFrames,
              });
            } else if (!speechActive && loudFrames === 0) {
              clearAudioWarningSoon();
            }

            if (!speechActive && !loudMedia && rms < roomFloorRms * 1.4) {
              roomFloorRms = roomFloorRms * 0.995 + rms * 0.005;
            }

            if (speechActive) {
              reportDetectedAudio("speech_model");
            }
          }, 250);
        }

        connect();
      } catch (error) {
        if (!active) return;
        setState("offline");
        setMessage(deviceErrorMessage(error));
      }
    };

    const handleOnline = () => {
      if (!active || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
      reconnectTimer = undefined;
      connect();
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("pointerdown", resumeMicrophoneMonitoring, { passive: true });
    window.addEventListener("keydown", resumeMicrophoneMonitoring);
    void start();
    return () => {
      active = false;
      clearCaptureTimer();
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
      if (noiseTimer !== undefined) window.clearInterval(noiseTimer);
      if (noiseClearTimer !== undefined) window.clearTimeout(noiseClearTimer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("pointerdown", resumeMicrophoneMonitoring);
      window.removeEventListener("keydown", resumeMicrophoneMonitoring);
      socket?.close(1000, "Interview view closed");
      stream?.getTracks().forEach((track) => track.stop());
      if (voiceDetector) {
        void voiceDetector.destroy().finally(() => void audioContext?.close());
      } else {
        void audioContext?.close();
      }
    };
  }, [interviewType, onViolationCount, sessionId, token, websocketBaseUrl]);

  const tone = state === "verified" ? "bg-emerald-500/15 text-emerald-300" : state === "warning" || state === "offline" ? "bg-amber-500/15 text-amber-200" : "bg-white/10 text-slate-200";
  const microphoneAlert = Boolean(noiseWarning && !noiseWarning.startsWith("Calibrating"));

  return (
    <div className={`fixed bottom-3 right-3 z-40 overflow-hidden rounded-2xl border bg-slate-950 shadow-2xl transition-[width] sm:bottom-5 sm:right-5 ${livenessPrompt ? "w-72 border-amber-300/70" : "w-48 border-white/15"}`} aria-live="polite">
      <video aria-label="Identity monitoring camera" className="aspect-video w-full object-cover [transform:scaleX(-1)]" muted playsInline ref={videoRef} />
      {livenessPrompt ? (
        <div className="border-b border-amber-300/30 bg-amber-400 px-4 py-3 text-sm font-bold leading-5 text-slate-950" role="alert" aria-live="assertive">
          <div>{livenessPrompt}</div>
          <div className="mt-1 text-xs font-semibold">Do this now while facing the camera. You have 20 seconds.</div>
        </div>
      ) : null}
      <div className={`flex items-start gap-2 px-3 py-2 text-[11px] leading-4 ${tone}`}>
        {state === "verified" ? <FiCheckCircle className="mt-0.5 shrink-0" aria-hidden /> : state === "connecting" ? <FiLoader className="mt-0.5 shrink-0 animate-spin" aria-hidden /> : <FiAlertTriangle className="mt-0.5 shrink-0" aria-hidden />}
        <span>{message}</span>
      </div>
      <div className={`flex items-center gap-2 border-t border-white/10 px-3 py-2 text-[11px] leading-4 ${microphoneAlert ? "bg-rose-500/20 text-rose-200" : "bg-slate-900 text-slate-300"}`}>
        <FiMic className="shrink-0" aria-hidden />
        <span>{noiseWarning || "Microphone monitoring active • keep the area quiet"}</span>
      </div>
    </div>
  );
}

function CheckItem({ icon, label, ready }: { icon: React.ReactNode; label: string; ready: boolean }) {
  return <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-slate-700"><span className={ready ? "text-emerald-600" : "text-slate-400"} aria-hidden>{icon}</span><span className="font-medium">{label}</span>{ready ? <FiCheckCircle className="ml-auto text-emerald-600" aria-hidden /> : null}</div>;
}

function StatusIcon({ state }: { state: CheckState }) {
  if (state === "checking") return <FiLoader className="h-5 w-5 animate-spin text-blue-600" aria-hidden />;
  if (state === "ready") return <FiCheckCircle className="h-5 w-5 text-emerald-600" aria-hidden />;
  if (state === "error") return <FiAlertTriangle className="h-5 w-5 text-rose-600" aria-hidden />;
  return <FiCamera className="h-5 w-5 text-slate-400" aria-hidden />;
}

function deviceErrorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === "NotAllowedError") return "Camera or microphone permission was denied. Allow both permissions in your browser settings and retry.";
  if (error instanceof DOMException && error.name === "NotFoundError") return "A working camera and microphone were not found.";
  return error instanceof Error ? error.message : "The device check could not be completed.";
}

function safeJson(value: unknown): { success?: boolean; type?: string; message?: string; error?: { message?: string }; data?: { violationCount?: number; livenessRequired?: boolean } } | null {
  try { return JSON.parse(String(value)); } catch { return null; }
}

function percentile(values: number[], fraction: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * fraction)))];
}

function friendlyMonitorMessage(value?: string) {
  if (!value) return "Face could not be verified. Stay centered in the camera.";
  if (/service is unavailable|connection reset|econnrefused|dns|internal server/i.test(value)) return "Live identity verification is reconnecting. Keep your face visible and remain on this screen.";
  return value;
}
