/* eslint-disable react-hooks/set-state-in-effect */
import BaseModal from "@/app/components/baseModal"
import { OTPBaseInput } from "@/app/components/baseOTPInput"
import { useEffect, useState } from "react"
import BaseInput from "@/app/components/baseInput"
import { UserDetails } from "../../page"
import { ReturnAllNumbers } from "@/app/includes/functions"
import BaseButton from "@/app/components/baseButton"
import useHttpHook from "@/app/includes/useHttpHook"
import { BaseLoader } from "@/app/components/baseLoader"

export const TxtPINModal = ({onClose,details}:{onClose:()=>void;details:UserDetails})=>{
const [changePIN,setChangePIN] = useState<{otp?:string;pin?:string}>({
            otp:"",
            pin:""
        })
const [sending,setSending] = useState<boolean>(false);
const [loading,setLoading] = useState<boolean>(false);
const {updatePIN,handleSendOtp} = useHttpHook();
const handleChangePIN = ()=>{
setLoading(true)
    updatePIN(changePIN).then((res)=>{
        setLoading(false)
        if(res.status)
        {
            onClose();
        }
    })
}
 useEffect(()=>{
        if(!sending)
        {
        setSending(true)
        handleSendOtp(details.email!).then((res)=>{
        setSending(false);
        })
        }
    },[])
    return <BaseModal 
        title={!sending?"Change Transaction PIN":""}
        onClose={()=>{
                    if(sending)
                    {
                        return ;
                    }
                    onClose();
                }}
                >
                {sending?<div className="m-auto  mt-5 text-center">
                <div className="m-auto flex justify-center item-center text-center">
                <BaseLoader color="green" size="lg" />
                </div>
                <div className="m-auto text-center">Please wait while we send you OTP...</div>
                </div>:<div>
            <div >Enter the 4-digit OTP sent you to your email address <b>({details.email})</b></div>
            <div className="mt-3 mb-2 ">
                <label  className="flex items-center text-md font-medium text-gray-700" style={{position:"relative"}}><small ><b>Enter 4-digit token</b></small><span className='text-red-600 text-[20px] ps-1'>*</span></label>
            </div>
        <div className="w-[200px] mb-5">
           <OTPBaseInput
            onChange={(otp)=>{
                setChangePIN({
                    ...changePIN,
                    otp})
               }}
                count={4} 
                isInputNum  
                />
                </div>
                 <BaseInput
                    required
                    type="password"
                    name="pin"
                    value={changePIN.pin}
                    onValueChange={({ value }) => {
                       setChangePIN({
                        ...changePIN,
                        pin:ReturnAllNumbers(value)
                    })
                    }}
                    max={4}
                    label="Transaction PIN"
                    placeholder="Enter Transaction PIN"
                />  
               <div 
            className="w-[150px] mt-[20px]"
            >
              <BaseButton
              type="button"
              disabled={changePIN.otp?.length !== 4 || changePIN.pin?.length !== 4}
              onClick={()=>{
                handleChangePIN()
              }}
              text="Save PIN"
              />  
            </div>
        </div>}
        </BaseModal>
}