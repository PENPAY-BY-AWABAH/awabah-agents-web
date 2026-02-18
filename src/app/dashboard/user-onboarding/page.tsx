/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useRouter, useSearchParams } from "next/navigation";
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
import { ReturnAllNumbers, ValidateEmail } from "@/app/includes/functions";
import { BaseLoader } from "@/app/components/baseLoader";
import useCommissionStore from "@/app/includes/store";
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
    tempPIN?:string;
    nextOfKinRegistered?:boolean;
    employerDetailsRegistered?:boolean;
    parentDetailRegistered?:boolean;
    hasBVN?:boolean;
}
const Page = () => {
    const {update} = useCommissionStore()
    const [index, setIndex] = useState<number>(0)
    const [userIsAgent, setUserIsAgent] = useState<boolean>(false)
    const [section, setSection] = useState<RegisterProps>("User Details")
    const navigate = useRouter();
    const { handleRegisterUser,ShowMessage,getUserByEmail, loading,handleCheckUserEmailIsAgent,RequestForRSAPIN } = useHttpHook();
    const [formData, setFormData] = useState<SignUpProps>({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        nin: "",
        bvn: "",
        rsaPin: "",
        trackingId:"",
        tempPIN:"",
        nextOfKinRegistered:false,
        employerDetailsRegistered:false,
        parentDetailRegistered:false
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
                if(res.message.includes("user already registered."))
                {
                    return setSection("Success")
                }
                setFormData(data);
                setSection("Verify Email")
            } else {
                if(res.data?.nextOfKinRegistered === false)
                {
                    return setSection("Next Of Kin")
                }
                if(res.data?.fatherRegistered === false)
                {
                    return setSection("Parent Details - (Father)")
                }
                if(res.data?.motherRegistered === false)
                {
                    return setSection("Parent Details - (Mother)")
                }
                if(res.data?.employerDetailsRegistered === false)
                {
                    return setSection("Employment Details")
                }
            }
        })
    }
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
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
         if(email)
        {
         getUserByEmail(email).then((res)=>{
            if(res.data?.nextOfKinRegistered === false)
            {
                setSection("Next Of Kin")
            }else if(res.data?.parentDetailRegistered === false)
            {
                setSection("Parent Details - (Father)")
            }else if(res.data?.employerDetailsRegistered === false)
            {
                setSection("Employment Details")
            }
            setFormData({
                ...res.data,
                phoneNumber:String(res.data?.phoneNumber).replace("+234","0"),
                trackingId:res.data?.trackingId
            })
         })   
        }else{
      const formFields = localStorage.getItem(CONSTANT.LocalStore.userFormFields);
      if(formFields)
      {
        setFormData(JSON.parse(formFields));
      }
    }
    },[email])

const handleRSAPIN = (e:FormEvent)=>{
    e.preventDefault()
    if(formData.rsaPin !== "")
    {
        return ShowMessage({status:false,message:String(formData.rsaPin).includes("AWA")?"User already registered for RSA PIN":"User already had RSA PIN",data:null,position:"center"})
    }

    RequestForRSAPIN({email:formData.email!,bvn:formData.bvn}).then((res)=>{
      if(res.data?.nextOfKinRegistered === false)
      {
        return setSection("Next Of Kin")
      }
      if(res.data?.fatherRegistered === false)
      {
        return setSection("Parent Details - (Father)")
      }
      if(res.data?.motherRegistered === false)
      {
        return setSection("Parent Details - (Mother)")
      }
      if(res.data?.employerDetailsRegistered === false)
      {
        return setSection("Employment Details")
      }
      if(res.status)
      {
        setFormData({
            ...formData,
            tempPIN:res.data.temp_rsa_pin
        })
       return setSection("Success")
      }
      ShowMessage({...res,message:String(res.message).replace("NIN and ",""),position:"center"})
    })
}
    const HandleCheckEmail = (email:string)=>{
        if(ValidateEmail(email))
        {
           handleCheckUserEmailIsAgent(email).then((res)=>{
            setUserIsAgent(res.status)
            if(res.data)
            {
              setFormData({
                ...formData,
                ...res.data
              })  
            }
            if(res.status)
            {
                setFormData(res.data)
            }
            if(res.data?.firstName)
            {
               setFormData(res.data) 
            }
            if(String(res.message).includes("not verified"))
            {
            return setSection("Verify Email");
            }
            
           });
        }
    }
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
                    {userIsAgent?<form 
                        className="mt-5"
                        onSubmit={handleRSAPIN}
                    >
                    <div className="text-[#909090] text-[12px] text-left">{String(formData.rsaPin).includes("AWA")?"Agent already has a temporary PIN":String(formData.rsaPin).includes("PEN")?"Agent already has a RSA PIN":"Request RSA PIN for this Agent."}</div>
                    <div className="text-[#009668] text-[14px] text-left mt-4">Details</div>
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
                            onBlur={()=>{
                                HandleCheckEmail(String(formData.email).trim())
                            }}
                        />
                      {!formData.hasBVN &&<BaseInput
                            type="text"
                            name="BVN"
                            value={formData.bvn}
                            required
                            onValueChange={({ value }) => {
                              setFormData({
                                    ...formData,
                                    bvn: value
                                }) 
                            }}
                            max={11}
                            label={`BVN`}
                            placeholder="Enter BVN."
                        />}
                    <BaseInput
                            type="text"
                            name="firstName"
                            disabled
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
                            disabled
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
                        
                         {formData.rsaPin &&<BaseInput
                            type="text"
                            name="rsaPin"
                            disabled
                            value={formData.rsaPin}
                            required
                            onValueChange={({ value }) => {
                               
                            }}
                            max={40}
                            label={`${String(formData.rsaPin).includes("AWA")?"Temporary RSA PIN":"RSA PIN"}`}
                            placeholder="Enter rsaPin."
                        />}
                      
                    <div className="mt-5" >
                    <BaseButton
                    disabled={formData.rsaPin !== ""}
                            text="Request RSA PIN"
                            type="submit"
                        />
                        </div>
                    </form>:<div>
                    <div className="text-[#909090] text-[12px] text-left">Please provide some information about the user, these information are used to protect users account and for compliance purpose.</div>
                    <div className="text-[#009668] text-[14px] text-left mt-4">Personal Details</div>
                    <form onSubmit={handleSubmit}
                    className="mt-5"
                    >
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
                             onBlur={()=>{
                                HandleCheckEmail(String(formData.email).trim())
                            }}
                        />
                        <BaseInput
                        disabled={formData.hasBVN}
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
                             onBlur={()=>{
                                HandleCheckEmail(String(formData.email).trim())
                            }}
                        />
                        <BaseInput
                        disabled={formData.hasBVN}
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
                        disabled={formData.hasBVN}
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
                        {!formData.hasBVN &&<BaseInput
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
                        />}
                        {!formData.hasBVN &&<BaseInput
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
                        />}
                        <BaseButton
                            text="Next"
                            type="submit"
                        />

                    </form>
                    </div>}
                {loading && <BaseLoader modal color="green" size="lg" />}
                </div>}
                {section === "Verify Email" && <div >
                    <OtpSection
                        email={formData.email!}
                        trackingId={formData.trackingId!}
                        onClose={() => {
                            if(formData.nextOfKinRegistered === false)
                            {
                            return setSection("Next Of Kin")
                            }
                            if(formData.parentDetailRegistered === false)
                            {
                            return setSection("Parent Details - (Father)")
                            }
                             if(formData.employerDetailsRegistered === false)
                            {
                            return setSection("Employment Details")
                            }
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
                        onSuccess={(tempPIN) => {
                        update({showCommissionBalance:true});
                        setFormData({
                            ...formData,
                            tempPIN
                        })
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
            localStorage.setItem(CONSTANT.LocalStore.remit,JSON.stringify({
            rsaPin: formData.tempPIN,
            pfaName: "",
            providerId: "",
            phoneNumber:String(formData.phoneNumber).replace("undefined","").replace("+234","0"),
            amount: 3000,
            fullName: formData.firstName+" "+formData.lastName,
            isValid: false
            }))
            navigate.push(ROUTES.remit)
            }}
            email={formData.email!}
            userIsAgent={userIsAgent}
            tempPIN={formData.tempPIN! || formData.rsaPin!}
        />}
    </div>
}
export default Page;