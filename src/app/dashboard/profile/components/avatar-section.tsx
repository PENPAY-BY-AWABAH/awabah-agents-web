/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { UserDetails } from "../../page"
import useHttpHook from "@/app/includes/useHttpHook";
import { BaseLoader } from "@/app/components/baseLoader";
import { placeHolderAvatar } from "@/app/includes/constants";

export const AvatarSection = ({details,onReloadProfile}:{details:UserDetails;onReloadProfile:()=>void;})=>{
const fileUploadInputRef = useRef<HTMLInputElement>(null)
const { updateAvatar } = useHttpHook();
const [avatar, setAvatar] = useState<string>(details.avatar!);
const [uploading, setUploading] = useState<boolean>(false);
const triggerClick = () => {
    // Safely trigger the hidden input
    if (fileUploadInputRef.current) {
      fileUploadInputRef.current?.click();
    }
  };

const handleFileChange = (e:any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      console.log("Selected file:", selectedFile.name);
      uploadFile(selectedFile);
    }
  };
const uploadFile = (selectedFile:any)=>{
    if(uploading)
    {
        return;
    }
    setUploading(true)
    updateAvatar(selectedFile).then((res)=>{
     setUploading(false) 
     if(res.status) 
     {
       onReloadProfile(); 
     }
    })
}
useEffect(()=>{
    if(details.avatar)
    {
    setAvatar(details.avatar!)
    }
},[details.avatar])
    return <div className="items-center text-center justify-center " >
              
                                <div
                                onClick={triggerClick}
                                className="lh-[65px] w-[65px] lg:h-[150px] lg:w-[150px] relative cursor-pointer bg-[#C4C4C459] border-[0.5px] rounded-[150px] overflow-hidden relative" >
                                   <input 
                                          ref={fileUploadInputRef}
                                          type="file"
                                          onChange={handleFileChange}
                                          className="absolute top-[0px] opacity-0"
                                          accept="image/*"
                                          />
                                    <img src={avatar ? avatar : placeHolderAvatar.src}
                                        alt={details.id}
                                        className="h-full w-full"
                                        onError={()=>{
                                            setAvatar(placeHolderAvatar.src)
                                        }}
                                        />
                                {uploading &&<div className="h-full flex item-center text-center justify-center w-full absolute top-0 left-0 bg-[#00000061] " >
                                <div className="m-auto">
                                <BaseLoader color="green" size="lg" />
                                </div>
                                </div>}
                                </div>
                                <button
                                onClick={triggerClick}
                                className="underline cursor-pointer m-auto text-[12px] lg:text-[14px] text-[#1455E0] mt-3 "
                                >
                                Change Image
                                </button>
                            </div>
}