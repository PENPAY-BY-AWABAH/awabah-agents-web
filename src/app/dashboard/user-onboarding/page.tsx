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
import { OtpSection } from "./components/otpSection";
import { NextOfKinPage } from "./components/nextOfKin";
import { SuccessComponent } from "./components/success";
import { PaymentComponent } from "./components/payment";
type RegisterProps = "User Details" | "Verify Email" | "Next Of Kin" | "Success" | "Pay";
export interface SignUpProps {
email?:string;
firstName?:string;
lastName?:string;
phoneNumber?:string;
address?:string;
nin?:string;
bvn?:string;
}
const Page = () => {
    const [index,setIndex] =  useState<number>(0)
    const [section, setSection] = useState<RegisterProps>("User Details")
    const navigate = useRouter();
    const { handleRegisterUser, loading } = useHttpHook();
    const [formData, setFormData] = useState<SignUpProps>({
        email: "",
        firstName:"",
        lastName:"",
        phoneNumber:"",
        address:"",
        nin:"",
        bvn:""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleRegisterUser(formData).then((res) => {
            if(String(res.message).includes("OTP"))
            {
                return setSection("Verify Email");
            }
            if (res.status) {
               setSection("Verify Email")
            }else{
                
                
                if(res.data?.nextOfKinRegistered === false)
                {

                }
                if(res.data?.employerDetailsRegistered === false)
                {

                }
            }
        })
    }
    useEffect(()=>{ 
        if(section === "User Details")
        {
            setIndex(0)
        }
         if(section === "Verify Email")
        {
            setIndex(1)
        }
          if(section === "Next Of Kin")
        {
            setIndex(2)
        }
    },[section])
    return <div className="bg-white h-full px-[100px] py-[60px]">
        {section !== "Success" && <div className="mb-6">
            <button
                onClick={() => {
                    if(section === "Next Of Kin")
                    {
                        return setSection("Verify Email")
                    }
                    if(section === "Verify Email")
                    {
                        return setSection("User Details")
                    }
                    navigate.back();
                }}
                className="flex items-center gap-2 cursor-pointer">
                <BackIcon />
                <div className="text-black text-[18px]">Back</div>
            </button>
        </div>}
        {section !== "Success" ?<div className="m-auto items-center text-center h-full overflow-x-scroll   ">
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow w-[500px] p-[30px] pb-[60px]">
                <div className="text-black text-[24px] font-bold text-center mb-[20px] ">{section}</div>
                <div className="w-[200px]">
                <BaseHorizontalIndicator 
                count={4} 
                selectedIndex={index}
                 />
                </div>
                {section === "User Details" &&<div className="mt-[20px]">
                    <div className="text-[#909090] text-[12px] text-left">Please provide some information about the user, these information are used to protect users account and for compliance purpose.</div>
                    <div className="text-[#009668] text-[14px] text-left mt-4">Personal Details</div>
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
                            value={formData.email}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    email: value
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
                        <BaseInput
                            type="text"
                            name="address"
                            value={formData.address}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    address: value
                                })
                            }}
                            max={140}
                            label="Address"
                            placeholder="Enter address."
                        />
                        <BaseInput
                            type="text"
                            name="nin"
                            value={formData.nin}
                            required
                            max={11}
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    nin: value
                                })
                            }}
                            label="NIN (National Identity Number)"
                            placeholder="Enter NIN."
                        />
                         <BaseInput
                            type="text"
                            name="bvn"
                            value={formData.bvn}
                            required
                            max={11}
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    bvn: value
                                })
                            }}
                            label="BVN (BANK Verification Number)"
                            placeholder="Enter BVN."
                        />
                        <BaseButton
                            loading={loading}
                            text="Next"
                            type="submit"
                        />
                        
                </form>
                </div>}
                    {section === "Verify Email" &&<div >
                    <OtpSection
                     email={formData.email!}
                     onClose={()=>{
                       setSection("Next Of Kin")
                     }}
                    />
                    </div>}

                    {section === "Next Of Kin" &&<div >
                    <NextOfKinPage 
                     onClose={()=>{
                       setSection("Next Of Kin")
                     }}
                     onSuccess={()=>{
                       setSection("Success") 
                     }}
                     email={formData.email!}
                    />
                    </div>}
                    {section === "Pay" &&<div >
                    <PaymentComponent
                       onSuccess={()=>{

                       }}   
                       userdata={formData}  
                    />
                    </div>}
            </div>
        </div>:<SuccessComponent 
        onPay={()=>{
         setSection("Pay")
        }}
        />}
    </div>
}
export default Page;