/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
import BaseButton from "@/app/components/baseButton"
import BaseInput from "@/app/components/baseInput"
import { OTPBaseInput } from "@/app/components/baseOTPInput"
import { LoginProps } from "@/app/includes/types"
import useHttpHook from "@/app/includes/useHttpHook"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const OtpSection = ({email}:{email:string})=>{
    const navigate = useRouter()
    const [success,setSuccess] = useState<boolean>(false)
    const [formData,setFormData] = useState<LoginProps>({
        email:"",
        password:"",
        confirmPassword:""
    })
    const [counter,setCounter] = useState<number>(0);
    const [otp,setOtp] = useState<string>("");
    const {handleEmailOTPVerification,loading} = useHttpHook();
    
    const handleOTPSubmit = ()=>{
        handleEmailOTPVerification({otp,email}).then((res)=>{
            setSuccess(res.status)
        })
    }
   
    const handleResend = ()=>{
        // handleOtp({otp});
    }
    useEffect(()=>{
        setFormData({
            ...formData,
            email
        })
    },[email])
    
    if(success)
    {
        return <div >
        <div className="text-black text-[24px]  text-center ">Create New Password</div>
        <div 
        className="text m-auto my-[30px] w-[220px] w-full " >
        <BaseInput 
        type="password"
        name="password"
        value={formData.password}
        required
        onValueChange={({value})=>{
            setFormData({
                ...formData,
                password:value
            })
        }}
        label="New Password"
        placeholder="Enter New Password."
        />
         <BaseInput 
        type="password"
        name="confirmPassword"
        max={20}
        value={formData.confirmPassword}
        required
        onValueChange={({value})=>{
            setFormData({
                ...formData,
                confirmPassword:value
            })
        }}
        label="Confirm Password"
        placeholder="Enter confirm Password."
        />
         <div 
        className="mt-10" />
        <BaseButton
        loading={loading}
        text="Save Password"
        type="submit"
        
        />
        </div>
    </div>
    }
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
      <div className="text-[#B8860B] text-[14px] font-normal text-center mb-4 mt-4 w-[80%] m-auto">{counter.toPrecision(2)}</div>
        <BaseButton
        disabled={otp.length !== 4}
        text="Verify"
        type="button"
        onClick={()=>handleOTPSubmit()}
        />
         <div className="flex items-center justify-center mt-[30px] gap-1">
            <span className="text-[14px] text-black">Didn't get a code?</span>
            <button 
            onClick={handleResend}
            className="text-[14px] text-[#009668] cursor-pointer"
            >Resend</button>
        </div>
        </div>
    </div>
}