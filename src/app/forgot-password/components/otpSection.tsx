/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
import BaseButton from "@/app/components/baseButton"
import BaseInput from "@/app/components/baseInput"
import { BaseLoader } from "@/app/components/baseLoader"
import { OTPBaseInput } from "@/app/components/baseOTPInput"
import { CONSTANT, ROUTES } from "@/app/includes/constants"
import { LoginProps } from "@/app/includes/types"
import useHttpHook from "@/app/includes/useHttpHook"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"

export const OtpSection = ()=>{
    const [startTimer,setStartTimer] = useState<boolean>(true)
    const [sending,setSending] = useState<boolean>(false)
    const navigate = useRouter()
    const [showPasswordSection,setShowPasswordSection] = useState<boolean>(false)
    const [formData,setFormData] = useState<LoginProps>({
        email:"",
        password:"",
        confirmPassword:""
    })
    const [counter,setCounter] = useState<number>(0);
    const [otp,setOtp] = useState<string>("");
    const {handleOtp,handleNewPassword,handleSendOtp,loading} = useHttpHook();
    const handleOTPSubmit = ()=>{
         setSending(true)
        handleOtp({otp}).then((res)=>{
            setSending(false)
            setShowPasswordSection(res.status)
        })
    }

    const handleNewPasswordSubmit = (e:FormEvent)=>{
        e.preventDefault()
        if(formData.password !== formData?.confirmPassword)
        {
            return toast.error("Password not match.")
        }
        setSending(true)
        handleNewPassword(formData).then((res)=>{
            setSending(false)
            if(res.status)
            {
               navigate.replace(ROUTES.login)
            }
        })
    }
    const handleResend = ()=>{
        setSending(true)
        setStartTimer(true)
        handleSendOtp(formData.email!).then((res)=>{
           setSending(false);
        })
    }
    useEffect(()=>{
        
        const email = localStorage.getItem(CONSTANT.LocalStore.resetPassword)
        if(email)
        {
        setFormData({
            ...formData,
            email
        })
        }
    },[])
    
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
    if(showPasswordSection)
    {
        return <div className="p-[16px]">
        <div className="text-black text-[24px]  text-center ">Create New Password</div>
      <form 
      onSubmit={handleNewPasswordSubmit}
      className="text m-auto p-[16px]"
      >
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
        text="Save Password"
        type="submit"
        />
        </div>
        </form>
        {loading && <BaseLoader color="green" modal size="lg" />}
    </div>
    }
    return <div className="p-[16px]">
        <div className="text-black text-[24px] font-semibold text-center ">Forgot Password</div>
        <div className="text-black text-[16px] font-semibold text-center mt-4 ">OTP Code</div>
      <div className="text-[#000000A6] text-[12px] font-normal text-center mb-4 mt-4 w-[80%] m-auto">Please enter the code sent to your email to change your password.</div>
      <div 
      className="text m-auto "
      >
        <div 
        className="text m-auto my-[30px] w-[220px] " >
        <OTPBaseInput
        onChange={(otp)=>{
        setOtp(otp)
        }}
        isInputNum={true}
        count={4}
        value={otp}
        />
        </div>
      <div className="text-[#B8860B] text-[14px] font-normal text-center mb-[16px] mt-4 w-[80%] m-auto">{counter.toPrecision(2)}</div>
        <BaseButton
        disabled={otp.length !== 4}
        text="Verify"
        type="button"
        onClick={()=>handleOTPSubmit()}
        />
         <div className="flex items-center justify-center mt-[30px] gap-1">
            <span className="text-[14px] text-black">Didn't get a code?</span>
            <button 
            onClick={()=>handleResend()}
            className="text-[14px] text-[#009668] cursor-pointer"
            >Resend</button>
        </div>
        </div>
        {sending && <BaseLoader color="green" modal size="lg" />}
    </div>
}