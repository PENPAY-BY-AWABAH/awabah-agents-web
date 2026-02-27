/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import {useState } from "react";
import BaseButton from "@/app/components/baseButton";
import BaseToggleBtn from "@/app/components/baseCheckBox";
import useHttpHook from "@/app/includes/useHttpHook";
import { BaseLoader } from "@/app/components/baseLoader";
export interface BankProps {
  accountN?: string;
  firstName?: string;
  lastName?: string;
  town?: string;
  isFather?: string;
}

export const ConsentPage = ({onClose,onSuccess,trackingId,email}:{onClose:()=>void;onSuccess:(data:{rsaPin:string})=>void;trackingId:string;email:string;}) => {
    const [agree,setAgree] = useState<boolean>(false);
    const {RequestForRSAPIN,loading} = useHttpHook()
    const handleSaveConsent = () => {
        RequestForRSAPIN({email,trackingId}).then((res)=>{
            if(res.status)
            {
            onSuccess(res.data);   
            }
        })
    }
    return <div className="mt-[20px]">
   <div className="m-auto items-center text-center ">
            <div className="m-auto items-center text-center ">
                    <div className="w-full justify-center items-center gap-6">
                        <div className="w-full">
                            <div className="flex items-center justify-center">
                                <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200 text-left">
                                    <div className="text-[13px] text-gray-600 space-y-2 ">
                                        <p>By proceeding with this onboarding process, you acknowledge and agree that:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>You have read and understood our terms and conditions</li>
                                            <li>You consent to the collection and processing of your personal information</li>
                                            <li>You authorize us to verify your employment information with your employer</li>
                                            <li>You agree to comply with all applicable laws and regulations</li>
                                            <li>You consent to receive communications related to your account and services</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                       
                        </div>
                        <div
                        className="w-full pb-[16px] text-left">
                            <div className="items-left mb-4 flex gap-2 items-center mt-5">
                            <BaseToggleBtn
                            onChange={()=>setAgree(!agree)}
                            value={agree}
                            type="custom"
                            />
                             <div className="text-gray-500 text-[14px] mt-0">
                            I agree to the terms and conditions
                        </div>
                            </div>
                            <BaseButton
                            disabled={!agree}
                            text={"Request for RSA PIN"}
                            type={"submit"}
                            onClick={()=>handleSaveConsent()}
                            />
                        </div>
                    </div>
                </div>
    </div>
    {loading && <BaseLoader color="green" size="lg" modal />}
    </div>
}