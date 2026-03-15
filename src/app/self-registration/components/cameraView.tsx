/* eslint-disable react-hooks/immutability */
import BaseModal from "@/app/components/baseModal";
import { CameraIcon, SwitchCamera } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};



export const CameraView = ({onSuccess,onClose}:{onSuccess:(data:string)=>void;onClose:()=>void})=>{
const videoRef = useRef<HTMLVideoElement>(null);
const [currentFacingMode,setFacingMode]= useState<"user" | "environment">("user")
const displayCamera = async (videoRef: React.RefObject<HTMLVideoElement | null>, facingMode: "user" | "environment" = "user") => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
      audio: false,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
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
  setFacingMode(newFacingMode);
  await displayCamera(videoRef, newFacingMode);
};
  useEffect(() => {
    displayCamera(videoRef);
    return () => {
       stopCamera();
    };
  }, []);
const stopCamera = ()=> {
  if (videoRef.current?.srcObject) {
  const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
  tracks.forEach(track => track.stop());
  // videoRef.current.srcObject = null;
  }
}
  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      stopCamera();
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        onSuccess(imageData);
      }
    }
  };
  
   return <BaseModal 
    onClose={()=>{
      stopCamera();
      onClose()
    }}
    title="Take a picture"
    slideUp={isMobile()}
    >
    <div className="h-[400px]">
    <div className="pt-[100px] w-[150px] m-auto">
   <div className="border relative border-gray-200 bg-gray-800 rounded-lg overflow-hidden h-[150px] w-[150px] ">
    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
    {isMobile() &&<button
    onClick={()=>flipCamera()}
    className="flex items-center justify-center w-[45px] h-[45px] cursor-pointer rounded-[60px] bg-white absolute bottom-[10px] right-[10px]"
    >
      <SwitchCamera />
    </button>}
    </div>
    <button 
    onClick={handleCapture}
    className="p-2 cursor-pointer border-[1px] text-green-800 border-green-800 rounded-[10px] flex items-center justify-center mt-5 gap-2 w-full hover:bg-gray-50 h-[45px]">
       <CameraIcon  />
      <div >Snap</div> 
    </button>
    </div>
    </div>
    </BaseModal>
}