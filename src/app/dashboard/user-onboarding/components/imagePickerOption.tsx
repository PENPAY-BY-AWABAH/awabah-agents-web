import BaseModal from "@/app/components/baseModal";
import { CameraIcon, ImageIcon } from "lucide-react";
import { isMobile } from "./cameraView";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const ImagePickerOption = ({onSelect,onClose}:{onSelect:(data:string)=>void;onClose:()=>void})=>{
    return <BaseModal 
    onClose={()=>{
onClose();
    }}
    title="Select option"
    slideUp={isMobile()}
    >
    <div className="grid grid-cols-1">
    <button 
    onClick={()=>onSelect("camera")}
    className="p-2 py-5 flex items-center gap-2 w-full">
       <CameraIcon />
       <div >Camera</div> 
    </button>
    <div className="h-[1px] bg-gray-100" />
    <button 
    onClick={()=>onSelect("gallery")}
    className="p-2 py-5 flex items-center gap-2 w-full">
       <ImageIcon />
       <div >Gallery</div> 
    </button>
    </div>
    </BaseModal>
}