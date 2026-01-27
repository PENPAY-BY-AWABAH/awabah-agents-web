/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import useHttpHook from "@/app/includes/useHttpHook";
import { CONSTANT, ROUTES } from "@/app/includes/constants";
import { BackIcon } from "@/app/assets/back-icon";
import BaseInput from "@/app/components/baseInput";
import BaseButton from "@/app/components/baseButton";
import { BaseHorizontalIndicator } from "@/app/components/baseHorizontalIndicator";
import { OtpSection } from "./components/otpSection";
import { NextOfKinPage } from "./components/nextOfKin";
import { SuccessComponent } from "./components/success";
import { PaymentComponent } from "./components/payment";
import { EmploymentPage } from "./components/employment";
import { ParentDetailPage } from "./components/parentDetails";
import { ReturnAllNumbers } from "@/app/includes/functions";
import { BaseLoader } from "@/app/components/baseLoader";
type RegisterProps = "User Details" | "Verify Email" | "Next Of Kin" | "Success" | "Pay" | "Employment Details" | "Parent Details - (Father)" | "Parent Details - (Mother)";
export interface SignUpProps {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    nin?: string;
    bvn?: string;
    rsaPin?: string;
    trackingId?:string;
}
const Page = () => {
    const [index, setIndex] = useState<number>(0)
    const [section, setSection] = useState<RegisterProps>("User Details")
    const navigate = useRouter();
    const { handleRegisterUser, loading } = useHttpHook();
    const [formData, setFormData] = useState<SignUpProps>({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        nin: "",
        bvn: "",
        rsaPin: "",
        trackingId:""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleRegisterUser(formData).then((res) => {
            if (String(res.message).includes("OTP")) {
                const data = {
                    ...formData,
                    ...res.data
                }
                localStorage.setItem(CONSTANT.LocalStore.userFormFields,JSON.stringify(data))
                setFormData(data);
                return setSection("Verify Email");
            }
            if (res.status) {
                const data = {
                    ...formData,
                    ...res.data
                }
                setFormData(data);
                setSection("Verify Email")
            } else {
                if (res.data?.nextOfKinRegistered === false) {
                    setSection("Next Of Kin")
                }
                if (res.data?.employerDetailsRegistered === false) {
                    setSection("Employment Details")
                }
                if (res.data?.parentDetailsRegistered === false) {
                    setSection("Parent Details - (Father)")
                }
                
            }
        })
    }

    useEffect(() => {
        if (section === "User Details") {
            setIndex(0)
        }
        if (section === "Verify Email") {
            setIndex(1)
        }
        if (section === "Next Of Kin") {
            setIndex(2)
        }
        if (section === "Parent Details - (Father)") {
            setIndex(3)
        }
         if (section === "Parent Details - (Mother)") {
            setIndex(4)
        }
         if (section === "Employment Details") {
            setIndex(5)
        }
    }, [section])
    useEffect(()=>{
      const formFields = localStorage.getItem(CONSTANT.LocalStore.userFormFields);
      if(formFields)
      {
        setFormData(JSON.parse(formFields));
      }
    },[])
    return <div className="bg-white h-full lg:px-[100px] lg:py-[60px] overflow-none">
        {section !== "Success" && <div className="mb-6">
            <button
                onClick={() => {
                    if (section === "Next Of Kin") {
                        return setSection("Verify Email")
                    }
                    if (section === "Verify Email") {
                        return setSection("User Details")
                    }
                    navigate.back();
                }}
                className="flex items-center gap-2 cursor-pointer">
                <span className="hidden lg:block" >
                    <BackIcon />
                </span>
                <span className="lg:hidden">
                    <BackIcon size={30} />
                </span>
                <div className="text-black text-[18px]">Back</div>
            </button>
        </div>}
        {section !== "Success" ? <div className="m-auto items-center text-center h-full overflow-x-scroll">
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] p-[16px] shadow lg:w-[500px] lg:p-[30px] pb-[180px] lg:pb-[60px]">
                <div className="text-black text-[24px] font-bold text-center mb-[20px] ">{section}</div>
                <div className="w-[200px]">
                    <BaseHorizontalIndicator
                        count={5}
                        selectedIndex={index}
                    />
                </div>
                {section === "User Details" && <div className="mt-[20px]">
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
                                    nin:ReturnAllNumbers(value)
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
                                    bvn: ReturnAllNumbers(value)
                                })
                            }}
                            label="BVN (BANK Verification Number)"
                            placeholder="Enter BVN."
                        />
                        <BaseButton
                            text="Next"
                            type="submit"
                        />

                    </form>
                {loading && <BaseLoader modal color="green" size="lg" />}
                </div>}
                {section === "Verify Email" && <div >
                    <OtpSection
                        email={formData.email!}
                        trackingId={formData.trackingId!}
                        onClose={() => {
                            setSection("Next Of Kin")
                        }}
                    />
                </div>}
                {section === "Next Of Kin" && <div >
                    <NextOfKinPage
                        onClose={() => {
                            setSection("Next Of Kin")
                        }}
                        onSuccess={() => {
                            setSection("Parent Details - (Father)")
                        }}
                        trackingId={formData.trackingId!}
                    />
                </div>}
                {section === "Pay" && <div >
                    <PaymentComponent
                        onSuccess={() => {

                        }}
                        userdata={formData}
                    />
                </div>}
                {section === "Employment Details" && <div >
                    <EmploymentPage
                        onSuccess={() => {
                        setSection("Success")
                        }}
                        onClose={() => {

                        }}
                        trackingId={formData.trackingId!}
                    />
                </div>}
                {section === "Parent Details - (Father)" && <div >
                    <ParentDetailPage
                        onSuccess={() => {
                        setSection("Parent Details - (Mother)")
                        }}
                        isFather={true}
                        onClose={() => {

                        }}
                        trackingId={formData.trackingId!}
                    />
                </div>}
                {section === "Parent Details - (Mother)" && <div >
                    <ParentDetailPage
                        isFather={false}
                        onSuccess={() => {
                        setSection("Employment Details")
                        }}
                        onClose={() => {

                        }}
                        trackingId={formData.trackingId!}
                    />
                </div>}
            </div>
        </div> : <SuccessComponent
            onPay={() => {
                navigate.push(ROUTES.users)
            }}
        />}
    </div>
}
export default Page;