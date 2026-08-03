/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import BaseButton from "@/app/components/baseButton";
import BaseInput from "@/app/components/baseInput";
import { BaseLoader } from "@/app/components/baseLoader";
import { OTPBaseInput } from "@/app/components/baseOTPInput";
import { ReturnAllNumbers } from "@/app/includes/functions";
import useHttpHook from "@/app/includes/useHttpHook";
import { useEffect, useState } from "react"

export const ForgotPINView = ({onClose}:{onClose:()=>void})=>{
const {handleForgotTransactionPin,handleSaveTxtPIN} = useHttpHook();
const [processing,setProcessing] = useState<boolean>(false);
const [loading,setLoading] = useState<boolean>(false);
const [message,setMessage] = useState<string>("");
const [formData,setFormData] = useState<{
 otp:string;   
 txtPin:string;   
}>({
    otp:"",
    txtPin:""
});
useEffect(()=>{
    setLoading(true)
    handleForgotTransactionPin().then((res)=>{
    setLoading(false)
    setMessage(res.message)
    })
},[])

const handleSubmit = ()=>{
setProcessing(true);
handleSaveTxtPIN({
  pin:formData.txtPin,
  otp:formData.otp 
}).then((res)=>{
setProcessing(false);
if(res.status)
{
    onClose();
}
})
}
return <div >
   {loading?<div className="flex items-center justify-center gap-3">
   <BaseLoader color="green" text="Sending OTP..." size="lg"/>
   <div >Sending OTP...</div>
   </div>
   :<div >
    <div className="text-sm">{message}</div>
    <div className="w-[200px] mt-3">
    <OTPBaseInput
    onChange={(otp)=>{
        setFormData({
            ...formData,
            otp
        });
    }}
    label="4 Digit OTP"
    value={formData.otp}
    count={4}
    required
    />
    </div>
 <div className="mt-3">
    <BaseInput 
    max={4}
label="New Transaction PIN"
    name="txt_pin"
    onValueChange={({value})=>{
    setFormData({
            ...formData,
            txtPin:value
        });
    }}
    type="text"
    value={ReturnAllNumbers(formData.txtPin)}
    required
    />
    </div>
    <BaseButton 
    text="Verify OTP"
    onClick={()=>{
        handleSubmit();
    }}
    type="button"
    disabled={formData.otp === "" || formData.txtPin === ""}
    />
    </div>}
    </div>
}