/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
import BaseButton from "@/app/components/baseButton"
import BaseInput from "@/app/components/baseInput"
import { BaseLoader } from "@/app/components/baseLoader"
import { OTPBaseInput } from "@/app/components/baseOTPInput"
import { ROUTES } from "@/app/includes/constants"
import { LoginProps } from "@/app/includes/types"
import useHttpHook from "@/app/includes/useHttpHook"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const RSAPinSection = ({email,onClose,onRSAPINRequest}:{email:string;onClose:()=>void;onRSAPINRequest:()=>void;})=>{
    const navigate = useRouter()
    const [success,setSuccess] = useState<boolean>(false)
    const [loading,setLoading] = useState<boolean>(false);
    const {handleRSAPINRequest} = useHttpHook();
    
    const handleOTPSubmit = ()=>{
        setLoading(true)
        handleRSAPINRequest({email}).then((res)=>{
            setLoading(false)
            setSuccess(res.status)
        })
    }
  
    return <div >
        <div className="text-black text-[16px] font-semibold text-center mt-4 ">OTP Code</div>
      <div className="text-[#000000A6] text-[12px] font-normal text-center mb-4 mt-4 w-[80%] m-auto">Please enter the code sent to your email to verify your identity and continue.</div>
      <div>
        {loading && <BaseLoader color="green" text="" size={"lg"} />}
    </div>
    </div>
}