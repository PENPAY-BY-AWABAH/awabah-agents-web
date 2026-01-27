/* eslint-disable react-hooks/exhaustive-deps */
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
import { SignUpProps } from "../page"

export const WalletPINSection = ({signUpForm,onSuccess}:{signUpForm:SignUpProps;onSuccess:()=>void})=>{
    const navigate = useRouter()
    const [success,setSuccess] = useState<boolean>(false)
    const [formData,setFormData] = useState<LoginProps>({
        email:"",
        password:"",
        confirmPassword:""
    })
    const [counter,setCounter] = useState<number>(0);
    const [pin,setPin] = useState<string>("");
    const [confirmPin,setConfirmPin] = useState<string>("");
    const {handleUpdateWalletPIN,loading} = useHttpHook();
    
    const handleWalletPIN = ()=>{
        handleUpdateWalletPIN({
            email:signUpForm.email,
            pin:confirmPin
        }).then((res)=>{
            setSuccess(res.status)
        })
    }
   
    useEffect(()=>{
        setFormData({
            ...formData,
            ...signUpForm
        })
    },[signUpForm])
    
    if(success)
    {
        return <div 
       >
        <div className="flex item-center justify-center p-10">
        <div className="w-[120px] h-[120px] border-[1px] border-[#009668] rounded-[120px] item-center justify-center">
        <svg width="60" height="60" className="m-auto mt-7" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M54.65 13.4798C55.72 16.2398 54.2225 18.1298 51.325 19.9948C48.9875 21.4948 46.01 23.1248 42.855 25.9073C39.76 28.6348 36.7425 31.9223 34.06 35.1573C31.7649 37.9345 29.5799 40.8009 27.51 43.7498C26.475 45.2273 25.0275 47.4323 25.0275 47.4323C24.5081 48.2348 23.7927 48.8916 22.9489 49.3408C22.1051 49.7901 21.1608 50.0169 20.205 49.9998C19.2498 49.9941 18.3119 49.7442 17.4805 49.2738C16.649 48.8034 15.9518 48.1282 15.455 47.3123C12.9575 43.1198 11.0325 41.4623 10.1475 40.8698C7.78 39.2748 5 39.0448 5 35.3348C5 32.3873 7.4875 29.9998 10.555 29.9998C12.7225 30.0798 14.735 30.9323 16.52 32.1323C17.66 32.8973 18.8675 33.9123 20.1225 35.2448C21.8044 32.9496 23.5535 30.7045 25.3675 28.5123C28.26 25.0248 31.675 21.2823 35.3375 18.0523C38.9375 14.8773 43.1 11.9048 47.5125 10.3348C50.3875 9.30979 53.5825 10.7173 54.65 13.4798Z" stroke="#009668" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </div>
        </div>
        <div className="text-black text-[14px] font-normal text-center mt-4 ">Wallet Pin set successfully!</div>
        <div className="text-black text-[14px] font-normal text-center mt-4 ">You can now securely use your agent account.</div>
        <div className="item-center justify-center px-10 pt-5">
        <BaseButton
        text="Go to login"
        type="button"
        onClick={()=>{
            navigate.replace(ROUTES.login)
        }}
        />
    </div>
    </div>
    }
    return <div >
      <div className="text-[#000000A6] text-[12px] font-normal text-center mb-4 mt-4 w-[80%] m-auto">Set a 4-digit PIN to secure withdrawals and sensitive actions on your account.</div>
      <div 
      className="text m-auto "
      >
      <div className="text-black text-[14px] font-normal text-center mb-1 mt-4 w-[80%] m-auto">Enter PIN</div>
        <div 
        className="text m-auto mb-[10px] w-[220px] " >
        <OTPBaseInput
        onChange={(otp)=>{
        setPin(otp)
        }}
        isInputNum
        count={4}
        />
        </div>
          <div className="text-black text-[14px] font-normal text-center mb-1 mt-4 w-[80%] m-auto">Confirm PIN</div>
         <div 
        className="text m-auto mb-[30px] w-[220px] " >
        <OTPBaseInput
        onChange={(otp)=>{
        setConfirmPin(otp)
        }}
        isInputNum
        count={4}
        />
        </div>
        <BaseButton
        disabled={pin.length !== 4 || confirmPin.length !== 4 || (pin !== confirmPin)}
        text="Continue"
        type="button"
        onClick={()=>handleWalletPIN()}
        />
        </div>
        {loading && <BaseLoader modal color="green" text="" size={"lg"} />}
    </div>
}