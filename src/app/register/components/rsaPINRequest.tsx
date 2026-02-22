/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseLoader } from "@/app/components/baseLoader"
import useHttpHook from "@/app/includes/useHttpHook"
import { useRouter } from "next/navigation"
import {  useState } from "react"

export const RSAPinSection = ({email}:{email:string;onClose:()=>void;onRSAPINRequest:()=>void;})=>{
    const [success,setSuccess] = useState<boolean>(false)
    const [loading,setLoading] = useState<boolean>(false);
  
    return <div >
        <div className="text-black text-[16px] font-semibold text-center mt-4 ">OTP Code</div>
      <div className="text-[#000000A6] text-[12px] font-normal text-center mb-4 mt-4 w-[80%] m-auto">Please enter the code sent to your email to verify your identity and continue.</div>
      <div>
        {loading && <BaseLoader color="green" text="" size={"lg"} />}
    </div>
    </div>
}