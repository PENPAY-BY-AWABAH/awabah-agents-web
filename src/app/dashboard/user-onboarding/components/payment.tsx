/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseButton from "@/app/components/baseButton";
import BaseInput from "@/app/components/baseInput";
import useHttpHook from "@/app/includes/useHttpHook";
import { SignUpProps } from "@/app/register/page";
import { FormEvent, useEffect, useState } from "react"
interface PaymentProps {
    rsaPIN?:string;
    phoneNumber?:string;
    providerId?:string;
}
export const PaymentComponent = ({onSuccess,userdata}:{onSuccess:()=>void;userdata:SignUpProps})=>{
    const { handleRemiteMicroPensions, loading , getRSAPIN} = useHttpHook();
    const [showPayment,setShowPayment] = useState<boolean>(false);
    const [formData, setFormData] = useState<PaymentProps>({
        rsaPIN:"",
        phoneNumber:"",
        providerId:""
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleRemiteMicroPensions(formData).then((res) => {
            if (res.status) {
            onSuccess()
            }
        })
    }

    useEffect(()=>{ 
        getRSAPIN(userdata.email!).then((res)=>{
        if(res.status)
        {
           setFormData(res.data) 
        }
        })
    },[])
    return <div className="mt-[20px]">
    <div >
     <div className="text-[#009668] text-[14px] text-left mt-4">{showPayment?"Pay":"User Details"}</div>
     {!showPayment?<div >
    <div className="bg-[#00966826] p-3">
    <div className="flex items-center gap-3 justify-center">
            <div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0052 8.33341C11.8462 8.33341 13.3385 6.84103 13.3385 5.00008C13.3385 3.15913 11.8462 1.66675 10.0052 1.66675C8.16426 1.66675 6.67188 3.15913 6.67188 5.00008C6.67188 6.84103 8.16426 8.33341 10.0052 8.33341Z" stroke="#009668"/>
            <path d="M16.6693 14.5835C16.6693 16.6543 16.6693 18.3335 10.0026 18.3335C3.33594 18.3335 3.33594 16.6543 3.33594 14.5835C3.33594 12.5127 6.32094 10.8335 10.0026 10.8335C13.6843 10.8335 16.6693 12.5127 16.6693 14.5835Z" stroke="#009668"/>
            </svg>
            </div>
        <div >{userdata.fullName}</div>
    </div>
    <div className="flex items-center justify-center">
        <div >RSA Pin:</div>
        <div className="flex-1 items-center justify-end">

        </div>
    </div>
     <div className="flex items-center justify-center">
        <div >PFA Name:</div>
        <div className="flex-1 items-center justify-end">

        </div>
    </div>
    </div>
     </div>:<form onSubmit={handleSubmit}>
                        <BaseInput
                            type="text"
                            name="rsaPIN"
                            value={formData.rsaPIN}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    rsaPIN: value
                                })
                            }}
                            disabled
                            max={11}
                            label="RSA PIN"
                            placeholder="Enter rsaPIN."
                        />
                        <BaseInput
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    phoneNumber: value
                                })
                            }}
                            disabled
                            max={11}
                            label="Phone Number"
                            placeholder="Enter phone number."
                        />
                        <BaseButton
                        
                            loading={loading}
                            text="Next"
                            type="submit"
                        />
       </form>}
    </div>
    </div>
}