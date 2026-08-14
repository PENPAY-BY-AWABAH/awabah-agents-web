import BaseModal from "@/app/components/baseModal";
import { CameraIcon, SwitchCamera } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import type { Face } from "@tensorflow-models/face-landmarks-detection";
import type { BoundingBox } from "@tensorflow-models/face-landmarks-detection/dist/shared/calculators/interfaces/shape_interfaces";

export const isMobile = (): boolean => {
  return typeof navigator !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const FACE_BOX_MARGIN = 18;
const MIN_CONFIDENCE = 0.5;
const DETECT_INTERVAL_MS = 260;
const MODEL_BACKEND = "webgl";

type FaceDetectionStatus =
  | "idle"
  | "loading-model"
  | "backend-error"
  | "model-error"
  | "running";

interface Box {
  xMin: number;
  yMin: number;
  width: number;
  height: number;
}

type DetectedFace = Face & { probability?: number[] };

export const CameraView = ({
  onSuccess,
  onClose,
}: {
  onSuccess: (data: string) => void;
  onClose: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectRafRef = useRef<number | null>(null);
  const lastDetectAtRef = useRef<number>(0);
  const isDetectingRef = useRef<boolean>(false);
  const facingModeRef = useRef<"user" | "environment">("user");
  const detectedFacesRef = useRef<DetectedFace[]>([]);
  const detectionStatusRef = useRef<FaceDetectionStatus>("idle");
  const modelRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const modelInitRef = useRef<Promise<faceLandmarksDetection.FaceLandmarksDetector> | null>(null);

  const [currentFacingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [captureError, setCaptureError] = useState<string>("");
  const [captureLoading, setCaptureLoading] = useState<boolean>(false);
  const [buttonMountTick, setButtonMountTick] = useState<number>(0);
  const [detectionStatus, setDetectionStatusState] = useState<FaceDetectionStatus>("idle");
  const [detectionError, setDetectionError] = useState<string>("");
  const [detectedFaces, setDetectedFacesState] = useState<DetectedFace[]>([]);

  const setDetectionStatus = useCallback<typeof setDetectionStatusState>((next) => {
    const value = typeof next === "function"
      ? (next as (prev: FaceDetectionStatus) => FaceDetectionStatus)(detectionStatusRef.current)
      : next;
    detectionStatusRef.current = value;
    setDetectionStatusState(value);
  }, []);
  const setDetectedFaces = useCallback<typeof setDetectedFacesState>((next) => {
    const value = typeof next === "function"
      ? (next as (prev: DetectedFace[]) => DetectedFace[])(detectedFacesRef.current)
      : next;
    if (Array.isArray(value)) {
      const prev = detectedFacesRef.current;
      if (prev.length !== value.length) {
        detectedFacesRef.current = value;
        setDetectedFacesState(value);
        return;
      }
      let changed = false;
      for (let i = 0; i < value.length; i += 1) {
        const a = prev[i]?.box as BoundingBox | undefined;
        const b = value[i]?.box as BoundingBox | undefined;
        if (!a || !b) { changed = true; break; }
        const delta =
          Math.abs(a.xMin - b.xMin) +
          Math.abs(a.yMin - b.yMin) +
          Math.abs(a.width - b.width) +
          Math.abs(a.height - b.height);
        if (delta > 6) { changed = true; break; }
      }
      if (changed) {
        detectedFacesRef.current = value;
        setDetectedFacesState(value);
      } else {
        detectedFacesRef.current = value;
      }
    }
  }, []);

  const ensureTfBackend = useCallback(async (): Promise<void> => {
    try {
      const currentBackend = tf.getBackend();
      if (currentBackend === MODEL_BACKEND) return;
      const ok = await tf.setBackend(MODEL_BACKEND);
      if (!ok) {
        throw new Error(`Backend '${MODEL_BACKEND}' could not be selected`);
      }
      await tf.ready();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown backend error";
      throw new Error(`WebGL backend failed: ${message.toLowerCase()}`);
    }
  }, []);

  const loadDetector = useCallback(async (): Promise<faceLandmarksDetection.FaceLandmarksDetector> => {
    if (modelRef.current) return modelRef.current;
    if (modelInitRef.current) return modelInitRef.current;
    const init = (async () => {
      setDetectionStatus("loading-model");
      await ensureTfBackend();
      const runtime = "tfjs" as const;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig = {
        runtime,
        refineLandmarks: true,
        maxFaces: 1,
      };
      const detector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        detectorConfig
      );
      modelRef.current = detector;
      setDetectionStatus("running");
      return detector;
    })();
    modelInitRef.current = init;
    try {
      return await init;
    } catch (err) {
      modelInitRef.current = null;
      throw err;
    }
  }, [ensureTfBackend, setDetectionStatus]);

  const displayCamera = async (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    facingMode: "user" | "environment" = "user"
  ) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        try {
          video.setAttribute("autoplay", "");
          video.setAttribute("playsinline", "");
          video.muted = true;
          await video.play();
        } catch (playErr) {
          console.warn("video.play() blocked, relying on autoPlay attribute:", playErr);
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const flipCamera = async () => {
    const newFacingMode = currentFacingMode === "user" ? "environment" : "user";
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    facingModeRef.current = newFacingMode;
    setFacingMode(newFacingMode);
    await displayCamera(videoRef, newFacingMode);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const drawOverlay = useCallback(
    (video: HTMLVideoElement, overlay: HTMLCanvasElement, faces: DetectedFace[], mirrored: boolean) => {
      const vw = video.videoWidth || 0;
      const vh = video.videoHeight || 0;
      const dw = overlay.clientWidth;
      const dh = overlay.clientHeight;
      overlay.width = Math.max(1, Math.floor(dw * (window.devicePixelRatio || 1)));
      overlay.height = Math.max(1, Math.floor(dh * (window.devicePixelRatio || 1)));
      const ctx = overlay.getContext("2d");
      if (!ctx) return;
      const scaleX = vw > 0 && dw > 0 ? overlay.width / vw : 1;
      const scaleY = vh > 0 && dh > 0 ? overlay.height / vh : 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      if (!Array.isArray(faces) || faces.length === 0) return;
      for (const face of faces) {
        const rawBox = face.box as Box | undefined;
        if (!rawBox) continue;
        const score = face.keypoints ? (face.probability?.[0] ?? 1) : 1;
        if (score < MIN_CONFIDENCE) continue;
        let x = (rawBox.xMin - FACE_BOX_MARGIN) * scaleX;
        let y = (rawBox.yMin - FACE_BOX_MARGIN) * scaleY;
        let w = (rawBox.width + FACE_BOX_MARGIN * 2) * scaleX;
        let h = (rawBox.height + FACE_BOX_MARGIN * 2) * scaleY;
        if (mirrored) {
          x = overlay.width - x - w;
        }
        x = Math.max(0, x);
        y = Math.max(0, y);
        w = Math.min(overlay.width - x, w);
        h = Math.min(overlay.height - y, h);
        ctx.save();
        const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
        gradient.addColorStop(0, "rgba(0, 150, 104, 0.08)");
        gradient.addColorStop(1, "rgba(0, 150, 104, 0.02)");
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
        const lineWidth = Math.max(2, Math.min(4, overlay.width / 180));
        const cornerLen = Math.min(w, h) * 0.16;
        ctx.strokeStyle = "#009668";
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(0, 150, 104, 0.45)";
        ctx.shadowBlur = 8;
        const tl: [number, number] = [x, y];
        const tr: [number, number] = [x + w, y];
        const bl: [number, number] = [x, y + h];
        const br: [number, number] = [x + w, y + h];
        ctx.beginPath();
        ctx.moveTo(tl[0], tl[1] + cornerLen);
        ctx.lineTo(tl[0], tl[1]);
        ctx.lineTo(tl[0] + cornerLen, tl[1]);
        ctx.moveTo(tr[0] - cornerLen, tr[1]);
        ctx.lineTo(tr[0], tr[1]);
        ctx.lineTo(tr[0], tr[1] + cornerLen);
        ctx.moveTo(bl[0], bl[1] - cornerLen);
        ctx.lineTo(bl[0], bl[1]);
        ctx.lineTo(bl[0] + cornerLen, bl[1]);
        ctx.moveTo(br[0] - cornerLen, br[1]);
        ctx.lineTo(br[0], br[1]);
        ctx.lineTo(br[0], br[1] - cornerLen);
        ctx.stroke();
        ctx.restore();
      }
    }, []);

  const getSourceCanvas = useCallback((vw: number, vh: number): HTMLCanvasElement | null => {
    let canvas = sourceCanvasRef.current;
    if (!canvas) {
      if (typeof document === "undefined") return null;
      canvas = document.createElement("canvas");
      sourceCanvasRef.current = canvas;
    }
    if (canvas.width !== vw || canvas.height !== vh) {
      canvas.width = vw;
      canvas.height = vh;
    }
    return canvas;
  }, []);

  const prepareFrameForInference = useCallback(
    (
      video: HTMLVideoElement,
      mirrored: boolean
    ): { source: HTMLCanvasElement; width: number; height: number } | null => {
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (vw <= 0 || vh <= 0) return null;
      const canvas = getSourceCanvas(vw, vh);
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (mirrored) {
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      return { source: canvas, width: vw, height: vh };
    },
    [getSourceCanvas]
  );

  const bestFaceFromList = useCallback((faces: DetectedFace[]): DetectedFace | null => {
    if (!Array.isArray(faces) || faces.length === 0) return null;
    let best: DetectedFace | null = null;
    let bestArea = -1;
    for (const f of faces) {
      const box = f.box as BoundingBox | undefined;
      if (!box) continue;
      const score = (f as unknown as { probability?: number[] }).probability?.[0] ?? 1;
      if (score < MIN_CONFIDENCE) continue;
      const area = box.width * box.height;
      if (area > bestArea) {
        bestArea = area;
        best = f;
      }
    }
    return best;
  }, []);

  const detectionLoop = useCallback((): void => {
    const raf = (): void => {
      detectRafRef.current = requestAnimationFrame(raf);
      const video = videoRef.current;
      const overlay = overlayCanvasRef.current;
      if (!video || !video.srcObject || !overlay) return;
      const mirrored = facingModeRef.current === "user";
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        drawOverlay(video, overlay, [], mirrored);
        return;
      }
      const curStatus = detectionStatusRef.current;
      if (curStatus === "backend-error" || curStatus === "model-error") {
        drawOverlay(video, overlay, [], mirrored);
        return;
      }
      const now = performance.now();
      if (now - lastDetectAtRef.current < DETECT_INTERVAL_MS || isDetectingRef.current) {
        drawOverlay(video, overlay, detectedFacesRef.current, mirrored);
        return;
      }
      const frame = prepareFrameForInference(video, mirrored);
      if (!frame) {
        drawOverlay(video, overlay, [], mirrored);
        return;
      }
      lastDetectAtRef.current = now;
      isDetectingRef.current = true;
      const detectorPromise = (async () => {
        try {
          return await loadDetector();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          const kind: FaceDetectionStatus =
            message.toLowerCase().includes("webgl") || message.toLowerCase().includes("backend")
              ? "backend-error"
              : "model-error";
          setDetectionStatus(kind);
          setDetectionError(message);
          return null;
        }
      })();
      detectorPromise.then((detector) => {
        if (!detector) {
          isDetectingRef.current = false;
          drawOverlay(video, overlay, [], mirrored);
          return;
        }
        detector
          .estimateFaces(frame.source, { flipHorizontal: false, staticImageMode: true })
          .then((faces) => {
            const arr: DetectedFace[] = (Array.isArray(faces) ? faces : []) as DetectedFace[];
            const accepted: DetectedFace[] = [];
            for (const f of arr) {
              const box = f.box as BoundingBox | undefined;
              if (!box) continue;
              const score = (f as unknown as { probability?: number[] }).probability?.[0] ?? 1;
              if (score < MIN_CONFIDENCE) continue;
              const xMin = Math.max(0, Math.min(frame.width - 1, Number(box.xMin) || 0));
              const yMin = Math.max(0, Math.min(frame.height - 1, Number(box.yMin) || 0));
              const width = Math.max(1, Math.min(frame.width - xMin, Number(box.width) || 1));
              const height = Math.max(1, Math.min(frame.height - yMin, Number(box.height) || 1));
              accepted.push({
                ...f,
                box: {
                  xMin,
                  yMin,
                  width,
                  height,
                  xMax: Math.min(frame.width, xMin + width),
                  yMax: Math.min(frame.height, yMin + height),
                } as Box & { xMax: number; yMax: number },
              });
            }
            setDetectedFaces(accepted);
            drawOverlay(video, overlay, accepted, mirrored);
          })
          .catch((err) => {
            console.warn("face detection tick error:", err);
            drawOverlay(video, overlay, detectedFacesRef.current, mirrored);
          })
          .finally(() => {
            isDetectingRef.current = false;
          });
      });
    };
    if (detectRafRef.current == null) detectRafRef.current = requestAnimationFrame(raf);
  }, [drawOverlay, loadDetector, prepareFrameForInference, setDetectionStatus, setDetectedFaces]);

  useEffect(() => {
    displayCamera(videoRef);
    let disposed = false;
    (async () => {
      try {
        await loadDetector();
        if (disposed) return;
        detectionLoop();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Model load failed";
        setDetectionError(message);
        setDetectionStatus(
          message.toLowerCase().includes("webgl") ? "backend-error" : "model-error"
        );
      }
    })();
    return () => {
      disposed = true;
      if (detectRafRef.current != null) {
        cancelAnimationFrame(detectRafRef.current);
        detectRafRef.current = null;
      }
      stopCamera();
      const detector = modelRef.current;
      modelRef.current = null;
      modelInitRef.current = null;
      if (detector && typeof (detector as unknown as { dispose?: () => void }).dispose === "function") {
        try {
          (detector as unknown as { dispose: () => void }).dispose();
        } catch (err) {
          console.warn("detector dispose warning:", err);
        }
      }
    };
  }, [loadDetector, detectionLoop, setDetectionStatus]);

  const validateImageDataUrl = (dataUrl: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        reject(new Error("Image load timed out"));
      }, 5000);
      const img = new Image();
      img.onload = () => {
        window.clearTimeout(timeout);
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve(dataUrl);
        } else {
          reject(new Error("Captured image has no dimensions"));
        }
      };
      img.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("Failed to decode captured image"));
      };
      img.src = dataUrl;
    });

  const faceDetectionReady =
    detectionStatus === "running" && Array.isArray(detectedFaces);

  const bestFaceBox: Box | null = useMemo(() => {
    const candidate = bestFaceFromList(detectedFaces);
    const raw = candidate?.box as BoundingBox | null | undefined;
    if (!raw) return null;
    return {
      xMin: raw.xMin,
      yMin: raw.yMin,
      width: raw.width,
      height: raw.height,
    };
  }, [bestFaceFromList, detectedFaces]);

  useEffect(() => {
    if (bestFaceBox || detectionStatus === "backend-error" || detectionStatus === "model-error") {
      setButtonMountTick((t) => t + 1);
    }
  }, [bestFaceBox, detectionStatus]);

  const captureGuidance = useMemo(() => {
    if (detectionStatus === "loading-model") {
      return "Loading face detection…";
    }
    if (detectionStatus === "backend-error") {
      return "Face detection unavailable (WebGL disabled). You can still snap a picture.";
    }
    if (detectionStatus === "model-error") {
      return "Face detection unavailable. You can still snap a picture.";
    }
    if (!bestFaceBox) {
      return "Position your face inside the circle";
    }
    if (bestFaceBox.width < 70 || bestFaceBox.height < 70) {
      return "Move a little closer to the camera";
    }
    if (bestFaceBox.width > 260 || bestFaceBox.height > 260) {
      return "Move a little further away from the camera";
    }
    return "Face detected — hold still and snap";
  }, [bestFaceBox, detectionStatus]);

  const canSnap =
    !captureLoading &&
    Boolean(videoRef.current?.srcObject) &&
    Boolean(
      videoRef.current &&
        (videoRef.current.readyState ?? 0) >= 2 &&
        (videoRef.current.videoWidth ?? 0) > 0 &&
        (videoRef.current.videoHeight ?? 0) > 0
    );

  const snapButtonText = useMemo(() => {
    if (captureLoading) return "Processing picture…";
    if (detectionStatus === "loading-model") return "Preparing…";
    if (!bestFaceBox && faceDetectionReady) return "Snap anyway";
    return "Snap";
  }, [captureLoading, detectionStatus, bestFaceBox, faceDetectionReady]);

  const handleCapture = async () => {
    setCaptureError("");
    const video = videoRef.current;
    if (!video || !video.srcObject) {
      setCaptureError("Camera stream is not available yet. Please wait a moment and try again.");
      return;
    }
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      setCaptureError("Camera feed is still loading. Please wait for the picture to appear then try again.");
      return;
    }
    try {
      setCaptureLoading(true);
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas 2D context not available");
      }
      if (currentFacingMode === "user") {
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else {
        ctx.drawImage(video, 0, 0);
      }
      const imageData = canvas.toDataURL("image/jpeg", 0.92);
      if (!imageData || !imageData.startsWith("data:image/jpeg;base64,")) {
        throw new Error("Captured data is not a valid JPEG");
      }
      const verifiedData = await validateImageDataUrl(imageData);
      stopCamera();
      onSuccess(verifiedData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown capture error";
      setCaptureError(`Could not capture a valid picture: ${message.toLowerCase()}`);
    } finally {
      setCaptureLoading(false);
    }
  };

  const guidanceColor = useMemo(() => {
    if (detectionStatus === "backend-error" || detectionStatus === "model-error") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }
    if (!bestFaceBox) {
      return "border-slate-200 bg-slate-50 text-slate-700";
    }
    if (bestFaceBox.width < 70 || bestFaceBox.height < 70) {
      return "border-sky-200 bg-sky-50 text-sky-700";
    }
    if (bestFaceBox.width > 260 || bestFaceBox.height > 260) {
      return "border-sky-200 bg-sky-50 text-sky-700";
    }
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }, [bestFaceBox, detectionStatus]);

  return (
    <BaseModal
      onClose={() => {
        stopCamera();
        onClose();
      }}
      title="Take a picture"
      slideUp={isMobile()}
    >
      <style>{`
        @keyframes cameraPopIn {
          0%   { transform: translateY(14px) scale(0.92); opacity: 0; }
          55%  { transform: translateY(-2px) scale(1.03); opacity: 1; }
          78%  { transform: translateY(1px) scale(0.995); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes cameraShimmer {
          0%   { background-position: -220% 0%; }
          100% { background-position: 220% 0%; }
        }
        @keyframes cameraPulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(0, 150, 104, 0.40), 0 10px 30px -14px rgba(15, 23, 42, 0.30); }
          70%  { box-shadow: 0 0 0 14px rgba(0, 150, 104, 0.00), 0 10px 30px -14px rgba(15, 23, 42, 0.30); }
          100% { box-shadow: 0 0 0 0 rgba(0, 150, 104, 0.00), 0 10px 30px -14px rgba(15, 23, 42, 0.30); }
        }
      `}</style>
      <div className="min-h-[400px]">
        <div className="pt-[40px] md:pt-[60px] w-[260px] md:w-[280px] m-auto">
          <div className="relative border border-gray-200 bg-gray-800 rounded-2xl overflow-hidden h-[260px] w-[260px] md:h-[280px] md:w-[280px] shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${currentFacingMode === "user" ? "scale-x-[-1]" : ""}`}
            />
            <canvas
              ref={overlayCanvasRef}
              aria-hidden
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
            <div className="pointer-events-none absolute inset-0">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <mask id="faceMask">
                    <rect width="100" height="100" fill="white" />
                    <circle cx="50" cy="46" r="36" fill="black" />
                  </mask>
                </defs>
                <rect
                  width="100"
                  height="100"
                  fill="rgba(15, 23, 42, 0.55)"
                  mask="url(#faceMask)"
                />
                <circle
                  cx="50"
                  cy="46"
                  r="36"
                  fill="none"
                  stroke={bestFaceBox ? "#009668" : "rgba(255,255,255,0.7)"}
                  strokeWidth="1.2"
                  strokeDasharray="2 3"
                  opacity="0.85"
                />
              </svg>
            </div>
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
              <div className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-[0_6px_18px_-12px_rgba(15,23,42,0.5)] backdrop-blur pointer-events-none">
                {detectionStatus === "loading-model"
                  ? "Face AI loading"
                  : detectionStatus === "running"
                    ? `${bestFaceBox ? "1 face" : "No face"} detected`
                    : detectionStatus === "backend-error" || detectionStatus === "model-error"
                      ? "Face detection skipped"
                      : "Face detection idle"}
              </div>
              {isMobile() && (
                <button
                  type="button"
                  onClick={() => flipCamera()}
                  className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full bg-white/90 text-slate-700 shadow-[0_6px_18px_-12px_rgba(15,23,42,0.5)] backdrop-blur pointer-events-auto"
                >
                  <SwitchCamera size={18} />
                </button>
              )}
            </div>
            {!isMobile() && (
              <button
                type="button"
                onClick={() => flipCamera()}
                className="flex items-center justify-center w-[45px] h-[45px] cursor-pointer rounded-[60px] bg-white absolute bottom-[10px] right-[10px]"
              >
                <SwitchCamera />
              </button>
            )}
          </div>
          <div
            role="status"
            className={`mt-5 rounded-[14px] border px-4 py-3 text-[13px] md:text-[14px] leading-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${guidanceColor}`}
          >
            {captureGuidance}
          </div>
          {captureError && (
            <div
              role="alert"
              className="mt-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 text-red-700"
            >
              {captureError}
            </div>
          )}
          {detectionError && detectionStatus !== "running" && (
            <div
              role="note"
              className="mt-3 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-5 text-amber-700"
            >
              Face detection detail: {detectionError}
            </div>
          )}
          {(bestFaceBox ||
            detectionStatus === "backend-error" ||
            detectionStatus === "model-error") && (
            <div
              key={buttonMountTick}
              className="mt-5"
              style={{
                animation: "cameraPopIn 460ms cubic-bezier(0.22, 1.4, 0.36, 1) both",
                transformOrigin: "50% 100%",
              }}
            >
              <button
                type="button"
                onClick={handleCapture}
                disabled={!canSnap}
                className="group relative isolate overflow-hidden p-2 cursor-pointer border text-green-800 border-green-800 rounded-[10px] flex items-center justify-center gap-2 w-full h-12 disabled:cursor-not-allowed disabled:opacity-60 transition-transform duration-200 ease-out active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                style={{
                  animation: canSnap && !captureLoading && bestFaceBox
                    ? "cameraPulseRing 2600ms cubic-bezier(0.4, 0, 0.6, 1) 1 both"
                    : undefined,
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 10%, rgba(255,255,255,0.55) 48%, rgba(0,150,104,0.18) 52%, transparent 90%)",
                    backgroundSize: "220% 100%",
                    animation: "cameraShimmer 2200ms linear 1 both",
                    mixBlendMode: "screen",
                  }}
                />
                <span className="relative z-[1] inline-flex items-center justify-center transition-transform duration-200 ease-out group-hover:-translate-y-[1px] group-active:translate-y-0">
                  <CameraIcon className="transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95" />
                </span>
                <div className="relative z-[1] font-medium tracking-tight">{snapButtonText}</div>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          )}
          <span className="hidden">{Object.keys(tf).length}</span>
        </div>
      </div>
    </BaseModal>
  );
};
