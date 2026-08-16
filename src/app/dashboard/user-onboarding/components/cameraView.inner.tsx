import BaseModal from "@/app/components/baseModal";
import { CameraIcon, SwitchCamera } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FACE_BOX_MARGIN = 18;
const MIN_CONFIDENCE = 0.5;
const DETECT_INTERVAL_MS = 900;
const API_ENDPOINT = "https://ai.awabah.com/v1/detect-face/base64-image";
const API_TIMEOUT_MS = 8000;

interface Box {
  xMin: number;
  yMin: number;
  width: number;
  height: number;
}

interface Keypoint {
  x: number;
  y: number;
  z?: number;
  name?: string;
}

interface DetectedFace {
  box: Box & { xMax?: number; yMax?: number };
  keypoints?: Keypoint[];
  probability?: number[];
  score?: number;
}

export const isMobile = (): boolean => {
  return typeof navigator !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

type FaceDetectionStatus =
  | "idle"
  | "connecting"
  | "api-error"
  | "running";

type ApiFaceRaw = {
  boundingBox?: {
    x?: unknown; y?: unknown; width?: unknown; height?: unknown;
  };
  bounding_box?: {
    x?: unknown; y?: unknown; width?: unknown; height?: unknown;
    x_min?: unknown; y_min?: unknown; x_max?: unknown; y_max?: unknown;
  } | {
    xMin?: unknown; yMin?: unknown; xMax?: unknown; yMax?: unknown;
    width?: unknown; height?: unknown;
  };
  box?: {
    x?: unknown; y?: unknown; width?: unknown; height?: unknown;
    x_min?: unknown; y_min?: unknown; x_max?: unknown; y_max?: unknown;
    xMin?: unknown; yMin?: unknown; xMax?: unknown; yMax?: unknown;
  };
  landmarks?:
    | Array<{ x: unknown; y: unknown; z?: unknown; name?: unknown }>
    | Record<string, { x?: unknown; y?: unknown; z?: unknown }>;
  keypoints?:
    | Array<{ x: unknown; y: unknown; z?: unknown; name?: unknown }>
    | Record<string, { x?: unknown; y?: unknown; z?: unknown }>;
  confidence?: unknown;
  score?: unknown;
  probability?: unknown[];
  [key: string]: unknown;
};

type ApiEnvelope = {
  faces?: unknown;
  detections?: unknown;
  data?: unknown;
  numFaces?: unknown;
  processingTimeMs?: unknown;
  status?: unknown;
  success?: unknown;
  error?: unknown;
  message?: unknown;
  bounding_box?: unknown;
  box?: unknown;
  landmarks?: unknown;
  keypoints?: unknown;
  confidence?: unknown;
  score?: unknown;
  probability?: unknown[];
  [key: string]: unknown;
};

const normalizeNumber = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
};

const isLikelyNormalized = (v: unknown): boolean => {
  const n = normalizeNumber(v);
  if (n === null) return false;
  return n >= 0 && n <= 1.01;
};

const valuesAreNormalized = (arr: unknown[]): boolean => {
  const nums = arr.map(normalizeNumber).filter((n): n is number => n !== null);
  if (nums.length === 0) return false;
  return nums.every((n) => n >= 0 && n <= 1.01) && nums.some((n) => n < 2);
};

const extractBoxFromFace = (
  face: ApiFaceRaw,
  canvasWidth: number,
  canvasHeight: number
): Box | null => {
  const raw = (face.boundingBox || face.bounding_box || face.box || {}) as Record<string, unknown>;
  let xMin = normalizeNumber(raw.x ?? raw.x_min ?? raw.xMin);
  let yMin = normalizeNumber(raw.y ?? raw.y_min ?? raw.yMin);
  let xMax = normalizeNumber(raw.x_max ?? raw.xMax);
  let yMax = normalizeNumber(raw.y_max ?? raw.yMax);
  let width = normalizeNumber(raw.width);
  let height = normalizeNumber(raw.height);

  const checkListNormalized = [xMin, yMin, xMax, yMax, width, height].filter(
    (v): v is number => normalizeNumber(v) !== null
  );
  const normalized = valuesAreNormalized(checkListNormalized);
  if (normalized && canvasWidth > 0 && canvasHeight > 0) {
    if (xMin !== null) xMin = xMin * canvasWidth;
    if (yMin !== null) yMin = yMin * canvasHeight;
    if (xMax !== null) xMax = xMax * canvasWidth;
    if (yMax !== null) yMax = yMax * canvasHeight;
    if (width !== null) width = width * canvasWidth;
    if (height !== null) height = height * canvasHeight;
  }

  if (xMin !== null && yMin !== null) {
    if (width === null && xMax !== null && xMin !== null) width = Math.max(1, xMax - xMin);
    if (height === null && yMax !== null && yMin !== null) height = Math.max(1, yMax - yMin);
  }
  if (xMin !== null && yMin !== null && width !== null && height !== null) {
    const x0 = Math.max(0, Math.min(canvasWidth - 1, xMin));
    const y0 = Math.max(0, Math.min(canvasHeight - 1, yMin));
    const w = Math.max(1, Math.min(canvasWidth - x0, width));
    const h = Math.max(1, Math.min(canvasHeight - y0, height));
    return { xMin: x0, yMin: y0, width: w, height: h };
  }

  if (xMin === null || yMin === null) {
    if (width !== null && height !== null) {
      const w = Math.max(1, Math.min(canvasWidth, width));
      const h = Math.max(1, Math.min(canvasHeight, height));
      return { xMin: 0, yMin: 0, width: w, height: h };
    }
    return null;
  }

  const w = Math.max(1, Math.min(canvasWidth - xMin, width ?? canvasWidth - xMin));
  const h = Math.max(1, Math.min(canvasHeight - yMin, height ?? canvasHeight - yMin));
  return { xMin: Math.max(0, xMin), yMin: Math.max(0, yMin), width: w, height: h };
};

const extractKeypoints = (
  face: ApiFaceRaw,
  canvasWidth: number,
  canvasHeight: number
): Keypoint[] | undefined => {
  const raw = face.landmarks || face.keypoints;
  let arr: Array<{ x: unknown; y: unknown; z?: unknown; name?: unknown }> = [];
  if (Array.isArray(raw) && raw.length > 0) {
    arr = raw as Array<{ x: unknown; y: unknown; z?: unknown; name?: unknown }>;
  } else if (raw && typeof raw === "object") {
    const rec = raw as Record<string, { x?: unknown; y?: unknown; z?: unknown }>;
    const entries = Object.entries(rec);
    for (const [name, value] of entries) {
      if (!value || typeof value !== "object") continue;
      arr.push({
      x: (value as { x?: unknown }).x,
      y: (value as { y?: unknown }).y,
      ...((value as { z?: unknown }).z !== undefined
        ? { z: (value as { z?: unknown }).z }
        : {}),
      name,
    });
    }
  }
  if (arr.length === 0) return undefined;

  const sampleCheck: unknown[] = [];
  for (const kp of arr) {
    if (!kp || typeof kp !== "object") continue;
    sampleCheck.push((kp as { x?: unknown }).x, (kp as { y?: unknown }).y);
    if (sampleCheck.length >= 8) break;
  }
  const normalized = valuesAreNormalized(sampleCheck);
  const sx = normalized && canvasWidth > 0 ? canvasWidth : 1;
  const sy = normalized && canvasHeight > 0 ? canvasHeight : 1;

  const out: Keypoint[] = [];
  for (const kp of arr) {
    if (!kp || typeof kp !== "object") continue;
    const kpObj = kp as Record<string, unknown>;
    let x = normalizeNumber(kpObj.x);
    let y = normalizeNumber(kpObj.y);
    if (x === null || y === null) continue;
    x = x * sx;
    y = y * sy;
    const zRaw = normalizeNumber(kpObj.z);
    const name = typeof kpObj.name === "string" ? kpObj.name : undefined;
    out.push({ x, y, ...(zRaw !== null ? { z: zRaw } : {}), ...(name ? { name } : {}) });
  }
  return out.length > 0 ? out : undefined;
};

const extractScore = (face: ApiFaceRaw): number => {
  if (Array.isArray(face.probability) && typeof face.probability[0] === "number") {
    return face.probability[0];
  }
  const c = normalizeNumber(face.confidence);
  if (c !== null) return c;
  const s = normalizeNumber(face.score);
  if (s !== null) return s;
  return 1;
};

const normalizeFace = (face: unknown, w: number, h: number): DetectedFace | null => {
  if (!face || typeof face !== "object") return null;
  const f = face as ApiFaceRaw;
  const box = extractBoxFromFace(f, w, h);
  if (!box) return null;
  const score = extractScore(f);
  if (score < MIN_CONFIDENCE) return null;
  if (isLikelyNormalized(score) && score <= 1) {
    // No-op (0..1 score is valid probability)
  }
  return {
    box: { ...box, xMax: box.xMin + box.width, yMax: box.yMin + box.height },
    keypoints: extractKeypoints(f, w, h),
    score,
    probability: [score],
  };
};

const collectFaceArray = (list: unknown, w: number, h: number): DetectedFace[] => {
  if (!Array.isArray(list)) return [];
  const out: DetectedFace[] = [];
  for (const item of list) {
    const face = normalizeFace(item, w, h);
    if (face) out.push(face);
  }
  return out;
};

const isEnvelope = (o: unknown): o is ApiEnvelope =>
  !!o && typeof o === "object";

const collectFacesFromPayload = (payload: unknown, w: number, h: number): DetectedFace[] => {
  if (Array.isArray(payload)) return collectFaceArray(payload, w, h);
  if (!isEnvelope(payload)) return [];

  if (Array.isArray(payload.faces)) {
    const tryInner = collectFaceArray(payload.faces, w, h);
    if (tryInner.length > 0) return tryInner;
    const first = payload.faces[0];
    if (isEnvelope(first) && (Array.isArray(first.faces) || Array.isArray(first.detections))) {
      return collectFacesFromPayload(first, w, h);
    }
    if (tryInner.length === 0 && isEnvelope(payload.faces)) {
      return collectFacesFromPayload(payload.faces, w, h);
    }
    return tryInner;
  }
  if (Array.isArray(payload.detections)) return collectFaceArray(payload.detections, w, h);
  if (payload.data !== undefined && payload.data !== null) {
    if (Array.isArray(payload.data)) return collectFaceArray(payload.data, w, h);
    if (isEnvelope(payload.data)) {
      return collectFacesFromPayload(payload.data, w, h);
    }
  }
  if (
    payload.bounding_box !== undefined ||
    payload.box !== undefined ||
    payload.landmarks !== undefined ||
    payload.keypoints !== undefined
  ) {
    const single = normalizeFace(payload, w, h);
    if (single) return [single];
  }
  return [];
};

const detectFacesApi = async (base64Image: string): Promise<unknown> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const body = JSON.stringify({ image: base64Image });
  try {
    const resp = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body,
      signal: controller.signal,
    });
    if (!resp.ok) {
      let msg = `HTTP ${resp.status}`;
      try {
        const errTxt = await resp.text();
        if (errTxt) msg += `: ${errTxt.slice(0, 160)}`;
      } catch {
          // ignore
      }
      throw new Error(msg);
    }
    const contentType = resp.headers.get("content-type") || "";
    let json: unknown;
    if (contentType.includes("application/json")) {
      json = await resp.json();
    } else {
      const txt = await resp.text();
      try { json = JSON.parse(txt); } catch { throw new Error("Response is not JSON"); }
    }
    if (isEnvelope(json)) {
      const err = json.error;
      if (err !== undefined && err !== null && err !== false && err !== 0 && err !== "") {
        throw new Error(
          typeof err === "string" ? err : JSON.stringify(err).slice(0, 200)
        );
      }
      if ("success" in json && json.success === false) {
        const m = json.message;
        throw new Error(typeof m === "string" && m ? m : "API returned success=false");
      }
    }
    return json;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const CameraViewInner = ({
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
  const lastKnownFrameSizeRef = useRef<{ w: number; h: number } | null>(null);

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
        const a = prev[i]?.box;
        const b = value[i]?.box;
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

  const displayCamera = async (
    videoRefArg: React.RefObject<HTMLVideoElement | null>,
    facingMode: "user" | "environment" = "user"
  ) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      const video = videoRefArg.current;
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
        const rawBox = face.box;
        if (!rawBox) continue;
        const score = face.probability?.[0] ?? face.score ?? 1;
        const normalizedScore = isLikelyNormalized(score) ? score : score / 100;
        if (normalizedScore < MIN_CONFIDENCE) continue;
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

        if (Array.isArray(face.keypoints) && face.keypoints.length > 0) {
          ctx.save();
          ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
          ctx.shadowBlur = 4;
          const kpSize = Math.max(2, Math.min(4, overlay.width / 260));
          const eyeKpSize = kpSize * 1.1;
          for (let i = 0; i < face.keypoints.length; i += 1) {
            const kp = face.keypoints[i];
            if (!kp) continue;
            const kx0 = kp.x * scaleX;
            const ky0 = kp.y * scaleY;
            const kx = mirrored ? overlay.width - kx0 : kx0;
            const ky = ky0;
            if (kx < 0 || ky < 0 || kx > overlay.width || ky > overlay.height) continue;
            const name = typeof kp.name === "string" ? kp.name.toLowerCase() : "";
            const isEye = /eye|iris|pupil/.test(name);
            const size = isEye ? eyeKpSize : kpSize;
            ctx.fillStyle = isEye ? "#fbbf24" : "#f472b6";
            ctx.strokeStyle = "rgba(15, 23, 42, 0.55)";
            ctx.lineWidth = Math.max(1, kpSize * 0.5);
            ctx.beginPath();
            ctx.arc(kx, ky, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        }
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
    ): { source: HTMLCanvasElement; width: number; height: number; base64Promise: Promise<string> } | null => {
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
      const base64Promise = Promise.resolve(canvas.toDataURL("image/jpeg", 0.82));
      return { source: canvas, width: vw, height: vh, base64Promise };
    },
    [getSourceCanvas]
  );

  const bestFaceFromList = useCallback((faces: DetectedFace[]): DetectedFace | null => {
    if (!Array.isArray(faces) || faces.length === 0) return null;
    let best: DetectedFace | null = null;
    let bestArea = -1;
    for (const f of faces) {
      const box = f.box;
      if (!box) continue;
      const score = f.probability?.[0] ?? f.score ?? 1;
      const normalizedScore = isLikelyNormalized(score) ? score : score / 100;
      if (normalizedScore < MIN_CONFIDENCE) continue;
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
      if (curStatus === "api-error") {
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
      if (detectionStatusRef.current !== "running") setDetectionStatus("connecting");

      frame.base64Promise
        .then(async (dataUrl) => {
          const frameSize = { w: frame.width, h: frame.height };
          lastKnownFrameSizeRef.current = frameSize;
          try {
            const rawPayload = await detectFacesApi(dataUrl);
            const normalized = collectFacesFromPayload(rawPayload, frameSize.w, frameSize.h);
            setDetectedFaces(normalized);
            setDetectionError("");
            setDetectionStatus("running");
            drawOverlay(video, overlay, normalized, mirrored);
          } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown detect-face API error";
            setDetectionError(message);
            setDetectionStatus("api-error");
            drawOverlay(video, overlay, [], mirrored);
          } finally {
            isDetectingRef.current = false;
          }
        })
        .catch((err) => {
          console.warn("frame base64 encode failed:", err);
          isDetectingRef.current = false;
          drawOverlay(video, overlay, detectedFacesRef.current, mirrored);
        });
    };
    if (detectRafRef.current == null) detectRafRef.current = requestAnimationFrame(raf);
  }, [drawOverlay, prepareFrameForInference, setDetectionStatus, setDetectedFaces]);

  useEffect(() => {
    displayCamera(videoRef);
    let disposed = false;
    detectionLoop();
    return () => {
      disposed = true;
      if (detectRafRef.current != null) {
        cancelAnimationFrame(detectRafRef.current);
        detectRafRef.current = null;
      }
      stopCamera();
      void disposed;
    };
  }, [detectionLoop]);

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
    if (!candidate?.box) return null;
    const raw = candidate.box;
    return {
      xMin: raw.xMin,
      yMin: raw.yMin,
      width: raw.width,
      height: raw.height,
    };
  }, [bestFaceFromList, detectedFaces]);

  type HorizPos = "Left" | "Center" | "Right";
  type VertPos = "Top" | "Middle" | "Bottom";
  type DistancePos = "Too close" | "Perfect distance" | "Move closer" | "Move back";

  const { horizLabel, vertLabel, distanceLabel } = useMemo<{
    horizLabel: HorizPos | null;
    vertLabel: VertPos | null;
    distanceLabel: DistancePos | null;
  }>(() => {
    if (!bestFaceBox) return { horizLabel: null, vertLabel: null, distanceLabel: null };
    const video = videoRef.current;
    const vw = video?.videoWidth ?? lastKnownFrameSizeRef.current?.w ?? 0;
    const vh = video?.videoHeight ?? lastKnownFrameSizeRef.current?.h ?? 0;
    if (vw <= 0 || vh <= 0) return { horizLabel: null, vertLabel: null, distanceLabel: null };
    const cx = bestFaceBox.xMin + bestFaceBox.width / 2;
    const cy = bestFaceBox.yMin + bestFaceBox.height / 2;
    const xRatio = cx / vw;
    const yRatio = cy / vh;
    let h: HorizPos = "Center";
    if (xRatio < 0.4) h = "Left";
    else if (xRatio > 0.6) h = "Right";
    let v: VertPos = "Middle";
    if (yRatio < 0.4) v = "Top";
    else if (yRatio > 0.6) v = "Bottom";
    let d: DistancePos = "Perfect distance";
    if (bestFaceBox.width < 70 || bestFaceBox.height < 70) d = "Move closer";
    else if (bestFaceBox.width > 260 || bestFaceBox.height > 260) d = "Move back";
    return { horizLabel: h, vertLabel: v, distanceLabel: d };
  }, [bestFaceBox]);

  const bestFaceConfidencePct = useMemo<string | null>(() => {
    const candidate = bestFaceFromList(detectedFaces);
    if (!candidate) return null;
    const score = candidate.probability?.[0] ?? candidate.score;
    if (typeof score !== "number" || !Number.isFinite(score)) return null;
    if (score <= 1.01) return `${Math.max(0, Math.min(100, Math.round(score * 100)))}%`;
    return `${Math.max(0, Math.round(score))}%`;
  }, [bestFaceFromList, detectedFaces]);

  const bestFaceConfidenceValue = useMemo<number>(() => {
    const candidate = bestFaceFromList(detectedFaces);
    if (!candidate) return 0;
    const score = candidate.probability?.[0] ?? candidate.score;
    if (typeof score !== "number" || !Number.isFinite(score)) return 0;
    if (score <= 1.01) return Math.max(0, Math.min(1, score)) * 100;
    return Math.max(0, Math.min(100, score));
  }, [bestFaceFromList, detectedFaces]);

  const isCenteredMiddleReady = useMemo<boolean>(() => {
    if (!bestFaceBox) return false;
    if (horizLabel !== "Center" || vertLabel !== "Middle") return false;
    return bestFaceConfidenceValue > 80;
  }, [bestFaceBox, horizLabel, vertLabel, bestFaceConfidenceValue]);

  useEffect(() => {
    if (isCenteredMiddleReady || detectionStatus === "api-error") {
      setButtonMountTick((t) => t + 1);
    }
  }, [isCenteredMiddleReady, detectionStatus]);

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
    if (detectionStatus === "connecting") return "Preparing…";
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
    if (detectionStatus === "api-error") {
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

  const statusPillLabel = useMemo<string>(() => {
    if (detectionStatus === "connecting") return "Face AI connecting";
    if (detectionStatus === "api-error") return "Face detection skipped";
    if (!bestFaceBox) {
      return detectionStatus === "running" ? "No face detected" : "Face detection idle";
    }
    const pos = [horizLabel, vertLabel].filter(Boolean).join("-");
    const count = detectedFaces.length > 1 ? `${detectedFaces.length} faces · ` : "";
    const conf = bestFaceConfidencePct ? ` · ${bestFaceConfidencePct}` : "";
    return `${count}${pos}${conf}`;
  }, [bestFaceBox, bestFaceConfidencePct, detectionStatus, detectedFaces.length, horizLabel, vertLabel]);

  const dynamicBanner = useMemo<string>(() => {
    if (detectionStatus === "connecting") return "Connecting to face detection…";
    if (detectionStatus === "api-error") return "Face detection unavailable. You can still snap a picture.";
    if (!bestFaceBox) return "Position your face inside the circle";
    if (distanceLabel === "Move closer") return `${horizLabel ?? "Center"} ${vertLabel ?? ""} ${horizLabel ? "·" : ""} Move a little closer to the camera`.trim().replace(/\s+/g, " ");
    if (distanceLabel === "Move back") return `${horizLabel ?? "Center"} ${vertLabel ?? ""} ${horizLabel ? "·" : ""} Move a little further away from the camera`.trim().replace(/\s+/g, " ");
    if (horizLabel && vertLabel && (horizLabel !== "Center" || vertLabel !== "Middle")) {
      return `${horizLabel}-${vertLabel} · move to the center of the circle`;
    }
    return bestFaceConfidencePct
      ? `Centered · match ${bestFaceConfidencePct} · hold still and snap`
      : `Centered · hold still and snap`;
  }, [bestFaceBox, bestFaceConfidencePct, detectionStatus, distanceLabel, horizLabel, vertLabel]);

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
        @keyframes cameraShimmer {
          0%   { background-position: -220% 0%; }
          100% { background-position: 220% 0%; }
        }
        @keyframes cameraPulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(0, 150, 104, 0.40), 0 10px 30px -14px rgba(15, 23, 42, 0.30); }
          70%  { box-shadow: 0 0 0 14px rgba(0, 150, 104, 0.00), 0 10px 30px -14px rgba(15, 23, 42, 0.30); }
          100% { box-shadow: 0 0 0 0 rgba(0, 150, 104, 0.00), 0 10px 30px -14px rgba(15, 23, 42, 0.30); }
        }
        @keyframes cameraPopIn {
          0%   { opacity: 0; transform: translateY(20px) scale(0.96); }
          60%  { opacity: 1; transform: translateY(-2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
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
                {statusPillLabel}
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
            {isMobile() && (
              <button
                type="button"
                onClick={() => flipCamera()}
                className="flex items-center justify-center w-[45px] h-[45px] cursor-pointer rounded-[60px] bg-white absolute top-[20px] right-[10px]"
              >
                <SwitchCamera />
              </button>
            )}
            <div
              role="status"
              aria-live="polite"
              className={`absolute left-1/2 -translate-x-1/2 bottom-[10px] rounded-[14px] px-3 py-1.5 text-[12px] leading-5 text-center backdrop-blur shadow-[0_8px_22px_-14px_rgba(15,23,42,0.55)] ${
                !bestFaceBox && detectionStatus !== "api-error"
                  ? "bg-slate-900/80 text-white"
                  : detectionStatus === "api-error"
                    ? "bg-amber-500/90 text-white"
                    : distanceLabel === "Move closer" || distanceLabel === "Move back"
                      ? "bg-sky-500/90 text-white"
                      : (horizLabel && vertLabel && (horizLabel !== "Center" || vertLabel !== "Middle"))
                        ? "bg-white/95 text-slate-800 border border-slate-200"
                        : "bg-emerald-500/92 text-white"
              }`}
              style={{
                width: "min(82%, 230px)",
              }}
            >
              {dynamicBanner}
            </div>
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
          <div className="h-[60px]">
          {(isCenteredMiddleReady || detectionStatus === "api-error") && (
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
                className="group relative isolate overflow-hidden p-2 cursor-pointer border text-green-800 border-green-800 rounded-[10px] flex items-center justify-center gap-2 w-full h-12 disabled:cursor-not-allowed disabled:opacity-60 transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                style={{
                  animation: canSnap && !captureLoading && isCenteredMiddleReady
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
                <span className="relative z-[1] inline-flex items-center justify-center">
                  <CameraIcon />
                </span>
                <div className="relative z-[1] font-medium tracking-tight">{snapButtonText}</div>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default CameraViewInner;
