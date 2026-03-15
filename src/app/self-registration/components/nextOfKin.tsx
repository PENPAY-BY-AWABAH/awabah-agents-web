/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import useHttpHook from "@/app/includes/useHttpHook";
import BaseInput from "@/app/components/baseInput";
import BaseButton from "@/app/components/baseButton";
import BaseSelect from "@/app/components/baseSelect";
import { ItemProps } from "@/app/includes/types";
import BaseModal from "@/app/components/baseModal";
import { BaseLoader } from "@/app/components/baseLoader";
import { CONSTANT } from "@/app/includes/constants";
export interface NextOfKinProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  relationShip?: string;
  gender?: string;
  phoneNumber?: string;
  nokemail?: string;
  streetName?: string;
  trackingId?:string;
}

export const NextOfKinPage = ({onSuccess,trackingId,userIsMinor}:{onClose:()=>void;onSuccess:(data:any)=>void;trackingId:string;userIsMinor?:boolean;}) => {
   
    const { handleNextOfKin, loading } = useHttpHook();
    const [formData, setFormData] = useState<NextOfKinProps>({
        trackingId:"",
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
        trackingId,
        minor:userIsMinor?1:0
    }).then((res) => {
        localStorage.setItem(CONSTANT.LocalStore.nextOfKin,JSON.stringify(formData))
            if (res.status) {
            onSuccess(res.data)
            }
        })
    }
    const unisex = ["COUSIN","SPOUSE","GUARDIAN","FRIEND","RELATIVES"].find((a)=>String(a).toLowerCase().includes(String(formData.relationShip).toLowerCase()))

    useEffect(()=>{ 
        if(!unisex)
        {
        const isMale = ["BROTHER","BROTHER-IN-LAW","FATHER","FATHER-IN-LAW","GRANDFATHER","GRANDSON","HUSBAND","NEPHEW","SON","SON-IN-LAW","UNCLE","FIANCE"].find((a)=>String(a).toLowerCase().includes(String(formData.relationShip).toLowerCase()))
        setFormData({
            ...formData,
            gender:isMale?"MALE":"FEMALE"
        })
        
        }else{
          setFormData({
            ...formData,
            gender:""
        })  
        }
        
    },[formData.relationShip,unisex])
    useEffect(()=>{
        const nxt = localStorage.getItem(CONSTANT.LocalStore.nextOfKin);
        if(nxt)
        {
           setFormData(JSON.parse(nxt))  
        }
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
                        <div className="text-left">
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
                    className="mb-5 " 
                    left
                    value={formData.relationShip!}                
                      />
                    </div>
                        <BaseInput
                            type="text"
                            name="nin"
                            value={formData.streetName}
                            required
                            max={150}
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    streetName: value
                                })
                            }}
                            label="Street Name"
                            placeholder="Enter street Name."
                        />
                        {unisex &&<div className="text-left mb-3">
                         <BaseSelect
                            name="gender"
                            left
                            list={[
                                {title:"MALE", description:"Male"},
                                {title:"FEMALE", description:"Female"}
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
                        </div> }
                        <div style={{zIndex:10}}>
                        <BaseButton
                            text="Next"
                            type="submit"
                        />
                        </div>
                </form>
    </div>
    {loading && <BaseLoader color="green" size="lg" modal  />}
    </div>
}