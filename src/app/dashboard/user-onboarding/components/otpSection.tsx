/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
import BaseButton from "@/app/components/baseButton"
import { BaseLoader } from "@/app/components/baseLoader"
import BaseModal from "@/app/components/baseModal"
import { OTPBaseInput } from "@/app/components/baseOTPInput"
import { LoginProps } from "@/app/includes/types"
import useHttpHook from "@/app/includes/useHttpHook"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const OtpSection = ({email,onClose,trackingId}:{email:string;onClose:()=>void;trackingId?:string})=>{
    const navigate = useRouter();
    const [success,setSuccess] = useState<boolean>(false)
    const [formData,setFormData] = useState<LoginProps>({
        email:"",
        password:"",
        confirmPassword:""
    })
    const [startTimer,setStartTimer] = useState<boolean>(true);
    const [counter,setCounter] = useState<number>(30);
    const [otp,setOtp] = useState<string>("");
    const {handleEmailOTPVerification,loading,handleSendOtp} = useHttpHook();
    const handleOTPSubmit = ()=>{
        handleEmailOTPVerification({otp,email}).then((res)=>{
            if(res.status)
            {
                onClose();
            }
        })
    }
   
    const handleResend = ()=>{
        handleSendOtp(email).then((res)=>{
        })
    }
    useEffect(()=>{
        setFormData({
            ...formData,
            email
        })
    },[email])
     useEffect(()=>{
        if(startTimer)
        {
        setCounter(30)
        setStartTimer(false)
       const intv = setInterval(()=>{
        setCounter((count)=>{
            if(count < 1)
            {
              clearInterval(intv)
              return 0; 
            }
            return count - 1;
        })
       },1000)
    }
    },[startTimer])
    
    return <div >
        <div className="text-black text-[16px] font-semibold text-center mt-4 ">OTP Code</div>
      <div className="text-[#000000A6] text-[12px] font-normal text-center mb-4 mt-4 w-[80%] m-auto">Please enter the code sent to your email to verify your identity and continue.</div>
      <div 
      className="text m-auto "
      >
        <div 
        className="text m-auto my-[30px] w-[220px] " >
        <OTPBaseInput
        onChange={(otp)=>{
        setOtp(otp)
        }}
        />
        </div>
      <div className="text-[#B8860B] text-[14px] font-normal text-center mb-4 mt-4 w-[80%] m-auto">0.{counter.toPrecision(2).replace("0.","")}</div>
        <BaseButton
        disabled={otp.length !== 4}
        text="Verify"
        type="button"
        onClick={()=>handleOTPSubmit()}
        />
         <div className="flex items-center justify-center mt-[30px] gap-1">
            <span className="text-[14px] text-black">Didn't get a code?</span>
            <button 
            disabled={counter !== 0}
            onClick={handleResend}
            className="text-[14px] text-[#009668] cursor-pointer"
            >Resend</button>
        </div>
        </div>
        {loading &&<BaseLoader color="green" size="lg" modal text="Sending..." />}
    </div>
}