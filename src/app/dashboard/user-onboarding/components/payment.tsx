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
    pfaName?:string;
    amount?:string;
}
export const PaymentComponent = ({onSuccess,userdata}:{onSuccess:()=>void;userdata:SignUpProps})=>{
    const { remitMicroPension, loading , getRSAPIN } = useHttpHook();
    const [formData, setFormData] = useState<PaymentProps>({
        rsaPIN:"",
        phoneNumber:"",
        providerId:"",
        pfaName:"",
        amount:""
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const amount = parseFloat(formData.amount || "0")
        if (amount < 3000) return alert("Minimum amount is ₦3,000")
        remitMicroPension({
            rsaPin: formData.rsaPIN,
            phoneNumber: userdata.phoneNumber || formData.phoneNumber,
            providerId: userdata.pfaCode || formData.providerId,
            pfaName: userdata.pfaName || formData.pfaName,
            fullName: (userdata.firstName || "") + " " + (userdata.lastName || ""),
            amount: amount,
            paymentOption: "monnify"
        }).then((res) => {
            if (res.status) {
            onSuccess()
            }
        })
    }

    useEffect(()=>{ 
        const payload: any = {};
        if (userdata.email) payload.email = userdata.email;
        if (userdata.trackingId) payload.trackingId = userdata.trackingId;
        getRSAPIN(payload).then((res)=>{
        if(res.status)
        {
           setFormData(prev => ({...prev, ...res.data, phoneNumber: prev.phoneNumber || res.data?.phoneNumber || userdata.phoneNumber || ""})) 
        } else {
           setFormData(prev => ({...prev, phoneNumber: prev.phoneNumber || userdata.phoneNumber || ""}))
        }
        })
    },[])
    return <div className="mt-[20px]">
     <div className="text-[#009668] text-[14px] text-left mt-4">Remittance</div>
     <form onSubmit={handleSubmit}>
        <BaseInput
            type="text"
            name="pfaName"
            value={userdata.pfaName || ""}
            required
            onValueChange={() => {}}
            disabled
            label="PFA"
            placeholder="PFA selected during registration"
        />
        <BaseInput
            type="text"
            name="phoneNumber"
            value={userdata.phoneNumber || formData.phoneNumber}
            required
            onValueChange={({ value }) => {
                setFormData({...formData, phoneNumber: value})
            }}
            disabled
            max={11}
            label="Phone Number"
            placeholder="Enter phone number."
        />
        <BaseInput
            type="number"
            name="amount"
            value={formData.amount}
            required
            onValueChange={({ value }) => {
                setFormData({...formData, amount: value})
            }}
            label="Amount (₦)"
            placeholder="Enter amount (min ₦3,000)"
        />
        <BaseButton
            loading={loading}
            text="Pay"
            type="submit"
        />
     </form>
    </div>
}
