/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import useHttpHook from "@/app/includes/useHttpHook";
import BaseInput from "@/app/components/baseInput";
import BaseButton from "@/app/components/baseButton";
import BaseToggleBtn from "@/app/components/baseCheckBox";

export interface ParentProps {
  trackingId?: string;
  firstName?: string;
  lastName?: string;
  town?: string;
  isFather?: string;
}

export const ParentDetailPage = ({onClose,onSuccess,trackingId,isFather}:{onClose:()=>void;onSuccess:()=>void;trackingId:string;isFather:boolean}) => {
    const navigate = useRouter();
    const { handleParentDetails, loading } = useHttpHook();
    const [formData, setFormData] = useState<ParentProps>({
        trackingId:"",
        firstName:"",
        lastName:"",
        town:"",
        isFather:""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleParentDetails({
        ...formData,
        trackingId:trackingId,
        isFather:isFather == true?"yes":"no"
    }).then((res) => {
    if (res.status) {
        onSuccess()
    }
    })
    }
    useEffect(()=>{ 
        
    },[])
    return <div className="mt-[20px]">
    <div >
            <div className="text-[#009668] text-[14px] text-left mt-4">{`Customer ${isFather?"Father's":"Mother's"} details`}</div>
                <form onSubmit={handleSubmit}>
                        <BaseInput
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    firstName: value
                                })
                            }}
                            max={40}
                            label="First Name"
                            placeholder="Enter first Name."
                        />
                        <BaseInput
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    lastName: value
                                })
                            }}
                            max={80}
                            label="Last Name"
                            placeholder="Enter last Name."
                        />
                        <div className="mb-5" >
                        <BaseInput
                            type="text"
                            name="town"
                            value={formData.town}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    town: value
                                })
                            }}
                            max={60}
                            label="Town"
                            placeholder="Enter town."
                        />
                        </div>
                        <BaseButton
                            loading={loading}
                            text="Next"
                            type="submit"
                        />
                </form>
    </div>
    </div>
}