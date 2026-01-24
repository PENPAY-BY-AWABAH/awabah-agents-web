/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import useHttpHook from "@/app/includes/useHttpHook";
import { ROUTES } from "@/app/includes/constants";
import { BackIcon } from "@/app/assets/back-icon";
import BaseInput from "@/app/components/baseInput";
import BaseButton from "@/app/components/baseButton";
import { BaseHorizontalIndicator } from "@/app/components/baseHorizontalIndicator";
import BaseSelect from "@/app/components/baseSelect";
import { ItemProps } from "@/app/includes/types";

export interface NextOfKinProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  relationShip?: string;
  gender?: string;
  phoneNumber?: string;
  nokemail?: string;
  streetName?: string;
}

export const NextOfKinPage = ({onClose,onSuccess,email}:{onClose:()=>void;onSuccess:()=>void;email:string}) => {
    const [index,setIndex] =  useState<number>(0)
    const navigate = useRouter();
    const { handleNextOfKin, loading } = useHttpHook();
    const [formData, setFormData] = useState<NextOfKinProps>({
        email:"",
        firstName:"",
        lastName:"",
        relationShip:"",
        gender:"",
        phoneNumber:"",
        nokemail:"",
        streetName:""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleNextOfKin({
        ...formData,
        email:formData.nokemail
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
            <div className="text-[#009668] text-[14px] text-left mt-4">Next of kin details</div>
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
                            placeholder="Enter First Name."
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
                            max={40}
                            label="Last Name"
                            placeholder="Enter last name."
                        />
                        <BaseInput
                            type="text"
                            name="email"
                            value={formData.nokemail}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    nokemail: value
                                })
                            }}
                            max={140}
                            label="Email"
                            placeholder="Enter Email."
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
                            max={11}
                            label="Phone Number"
                            placeholder="Enter phone number."
                        />
                    <BaseSelect
                    name="bvn"
                    list={["AUNTY", "BROTHER", "BROTHER-IN-LAW", "COUSIN", "DAUGHTER", "DAUGHTER-IN-LAW", "FATHER", "FATHER-IN-LAW", "FIANCE", "FIANCEE", "GRANDFATHER", "GRANDDAUGHTER", "GRANDMOTHER", "GRANDSON", "HUSBAND", "MOTHER", "MOTHER-IN-LAW", "NEPHEW", "NIECE", "SISTER", "SISTER-IN-LAW", "SON", "SON-IN-LAW", "SPOUSE", "UNCLE", "WIFE", "Guardian", "FRIEND", "RELATIVES"].map((item, index) => {
                        return { title: item, description: item };
                    }) as unknown as ItemProps[]}
                    required
                    custom
                    onValueChange={(value) => {
                        setFormData({
                            ...formData,
                            relationShip: value.title
                        });
                    } }
                    label="RelationShip"
                    placeholder="Enter relationShip."
                    className="mb-5" 
                    value={formData.relationShip!}                
                            />
                        <BaseInput
                            type="text"
                            name="nin"
                            value={formData.streetName}
                            required
                            max={11}
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    streetName: value
                                })
                            }}
                            label="Street Name"
                            placeholder="Enter street Name."
                        />
                         <BaseSelect
                            name="bvn"
                            list={[
                                {title:"Male", description:"Male"},
                                {title:"Female", description:"Female"}
                            ] as unknown as ItemProps[]}
                            required
                            custom
                            value={formData.gender!}
                            onValueChange={(value ) => {
                                setFormData({
                                    ...formData,
                                    gender: value.title
                                })
                            }}
                            label="Gender"
                            placeholder="Enter gender."
                            className="mb-5"
                        />
                        <BaseButton
                            loading={loading}
                            text="Next"
                            type="submit"
                        />
                </form>
    </div>
    </div>
}