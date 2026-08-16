import dynamic from "next/dynamic";

const CameraViewInner = dynamic<{
  onSuccess: (data: string) => void;
  onClose: () => void;
}>(() => import("./cameraView.inner").then((m) => m.CameraViewInner), {
  ssr: false,
});

export const isMobile = (): boolean =>
  typeof navigator !== "undefined" &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const CameraView = CameraViewInner;

export default CameraViewInner;
