/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import useHttpHook from "@/app/includes/useHttpHook";
import { CONSTANT, placeHolderAvatar, ROUTES } from "@/app/includes/constants";
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
import { BankDetailPage } from "./components/bankDetails";
import { ConsentPage } from "./components/consent";
import BaseSelect from "@/app/components/baseSelect";
import { ItemProps } from "@/app/includes/types";
import { CameraIcon, CheckCircle, ImageIcon, UploadIcon } from "lucide-react";
import { TickIcon } from "@/app/assets/tick-icon";
type RegisterProps = "User Details" | "Verify Email" | "Next Of Kin" | "Success" | "Pay" | "Employment Details" | "Parent / Guardian Details" | "Bank Details" | "Consent Agreement";
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
    pfaCode?:string;
    pfaName?:string;
    serviceNo?:string;
    serviceTitle?:string;
    photo?:string;
    signature?:string;
}
const Page = () => {
    const fileUploadInputRef = useRef<HTMLInputElement>(null);
    const signatueInputRef = useRef<HTMLInputElement>(null);
    
    const [listOfConsent, setListOfConsent] = useState<ItemProps[]>([]);
    const [index, setIndex] = useState<number>(0)
    const [userIsAgent, setUserIsAgent] = useState<boolean>(false);
    const [userIsMinor, setUserMinor] = useState<boolean>(false);
    const [section, setSection] = useState<RegisterProps>("User Details")
    const navigate = useRouter();
    const { handleRegisterUser,ShowMessage,getUserByEmail, loading,handleCheckUserEmailIsAgent,RequestForRSAPIN ,GetListOfSectors} = useHttpHook();
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
        parentDetailRegistered:false,
        pfaCode:"",
        pfaName:"",
        serviceTitle:"",
        serviceNo:"",
        photo:"",
        signature:""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleRegisterUser({
            ...formData,
        userType:userIsMinor?"MINOR":"ADULT"
    }).then((res) => {
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
                
            }
        })
    }
    const [avatar,setAvatar] = useState<string>("");
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
        
    }, [section])
    useEffect(()=>{
         if(email)
        {
         getUserByEmail(email).then((res)=>{
            if(res.data?.nextOfKinRegistered === false)
            {
                setSection("Next Of Kin")
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
            if(!res.status)
            {
             return setFormData({
                ...formData,
                hasBVN:false
              }) 
            }
            if(res.data)
            {
            setUserIsAgent(true)
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
    const pfaList:ItemProps[] = [
        {
            title:"Access Pensions",
            name:"Access Pensions",
            value:"024"
        },
        {
            title:"Leadway Pensions",
            name:"Leadway Pensions",
            value:"023"
        },
        {
            title:"Stanbic Ibtc Pension Managers",
            name:"Stanbic Ibtc Pension Managers",
            value:"021"
        }
    ];
    const ListOfSectors = () => {
        GetListOfSectors().then((res) => {
            if (res.status) {
                //set list of banks
                const data = res.data.map((a: any) => {
                    return {
                        title: a.Sector,
                        name: a.Sector,
                        value: a.EmployerCode
                    }
                })
                setListOfConsent(data);
            }
        })
    }
    useEffect(() => {
        ListOfSectors();
    }, []);

    useEffect(()=>{
        if(formData.photo)
        {
        setAvatar(formData.photo)
        }else{
        setAvatar(placeHolderAvatar.src)
        }
    },[formData.photo])

   const triggerClick = () => {
    // Safely trigger the hidden input
    if (fileUploadInputRef.current) {
      fileUploadInputRef.current?.click();
    }
  };

    const triggerSignatureClick = () => {
    // Safely trigger the hidden input
    if (signatueInputRef.current) {
      signatueInputRef.current?.click();
    }
  };

const handleFileChange = (e:any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      console.log("Selected file:", selectedFile.name);
    //   uploadFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      // This event fires when the file is successfully read
      reader.onload = function(e:any) {
        const base64String = e.target.result;
        setAvatar(base64String);
        setFormData({
            ...formData,
            photo:base64String
        })
      };
      reader.readAsDataURL(selectedFile);
    }
    }
  };
  
  const handleSignatureChange = (e:any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
    if (selectedFile) {
      const reader = new FileReader();
      // This event fires when the file is successfully read
      reader.onload = function(e:any) {
        const base64String = e.target.result;
        setFormData({
            ...formData,
            signature:base64String
        })
      };
      reader.readAsDataURL(selectedFile);
    }
    }
  };
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
                    <div className="flex items-center mt-5 border-[2px] border-green-700 rounded-md">
                      <button 
                        onClick={()=>{setUserMinor(false)}} 
                      className={`cursor-pointer text-[12px] ${userIsMinor?"text-green-700":"bg-green-700 text-white"}  text-center px-5 py-2 flex-grow`}>Adult</button>          
                      <button 
                        onClick={()=>{
                            setUserMinor(true)
                        }} 
                       className={`cursor-pointer text-[12px] ${userIsMinor?"bg-green-700 text-white":"text-green-700"} text-center px-5 py-2  flex-grow`}>Minor</button>          
                    </div>
                    <form onSubmit={handleSubmit}
                    className="mt-5"
                    >
                        <div 
                            className="w-[120px] relative cursor-pointer m-auto h-[120px] bg-gray-100 rounded-[120px] border-[3px] border-green-600"
                        >
                            <img 
                            className="w-full cursor-pointer m-auto h-full bg-gray-100 rounded-[120px] "
                            alt="avatar"
                            src={avatar}
                            onClick={triggerClick}
                            />
                            <UploadIcon className="absolute bottom-[-10px] right-[-10px]" 
                            onClick={triggerClick}
                            />
                             <input 
                             required
                                ref={fileUploadInputRef}
                                type="file"
                                onChange={handleFileChange}
                                className="absolute top-[87px] opacity-0
                                left-[-25px]
                                "
                                accept="image/*"
                                />
                        </div>
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

                        <div className={`w-full ${userIsMinor ? "bg-green-50 p-3 rounded-[20px] mb-3" : ""}`} >
                        {userIsMinor &&<div className="w-full text-left text-green-700 mb-2 font-bold">Parent / Guardian Details</div> }
                        {!formData.hasBVN &&<BaseInput
                            type="text"
                            name="nin"
                            className="bg-white"
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
                            className="bg-white"
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
                        </div>
                        <div className="text-left mb-4" >
                        <BaseSelect 
                        label="Pension Fund Administrator (PFA)"
                    list={pfaList}
                    placeholder="Select a Pension Fund Administrator"
                    name="pfa"
                    required
                    left
                    onValueChange={({value})=>{
                        const foundItem = pfaList.find((a)=>a.value === value)
                        if(foundItem)
                        {
                       setFormData({
                        ...formData,
                        pfaCode:value,
                        pfaName:foundItem?.title
                       })
                    }
                    }}
                    value={formData.pfaName!}
                    className=""
                    custom
                    />
                    </div>
                     <div className="text-left mb-4" >
                    <BaseSelect
                            custom
                            placeholder="Job Type"
                            name="serviceNo"
                            value={formData.serviceTitle!}
                            required
                            onValueChange={({ value }) => {
                                const foundItem = listOfConsent.find((a)=>a.value === value)
                                if(foundItem)
                                {
                                setFormData({
                                    ...formData,
                                    serviceNo: value,
                                    serviceTitle:foundItem?.title
                                })
                            }
                            }}
                            left
                            list={listOfConsent}
                            label="Select your Job type"
                        />
                    </div>
                     <div className={`mb-5 h-[45px] overflow-hidden flex gap-2 cursor-pointer items-center justify-center block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm relative `}
                        >
                           
                       {!formData?.signature?<UploadIcon />:<CheckCircle color="green" />}
                    <div className={`${formData?.signature?"text-green-700":"text-black"}`} >{formData?.signature?"Change Signature":"Upload Signature"}</div>
                       <input 
                             required
                                ref={signatueInputRef}
                                type="file"
                                onChange={handleSignatureChange}
                                className="absolute top-[0px] opacity-0
                                left-[0px]
                                w-full
                                h-[40px]
                                cursor-pointer
                                "
                                accept="image/*"
                                /> 
                        </div>
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
                            
                            setSection("Next Of Kin")
                        }}
                    />
                </div>}
                {section === "Next Of Kin" && <div >
                    <NextOfKinPage
                        onClose={() => {
                            setSection("Verify Email")
                        }}
                        onSuccess={(data) => {
                            setFormData({
                                ...formData,
                                ...data
                            })
                            setSection("Success")
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
                {/* {section === "Employment Details" && <div >
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
                </div>} */}
                {/* {section === "Parent / Guardian Details" && <div >
                    <ParentDetailPage
                        onSuccess={() => {
                        setSection("Pay")
                        }}
                        isFather={true}
                        onClose={() => {

                        }}
                        trackingId={formData.trackingId!}
                    />
                </div>}
                */}
            </div>
        </div> : <SuccessComponent
            onPay={() => {
            localStorage.setItem(CONSTANT.LocalStore.remit,JSON.stringify({
            rsaPin: formData.rsaPin,
            pfaName: formData.pfaName,
            providerId: formData?.pfaCode,
            phoneNumber:String(formData.phoneNumber).replace("undefined","").replace("+234","0"),
            amount: 3000,
            fullName: formData.firstName+" "+formData.lastName,
            isValid: false
            }))
            navigate.push(ROUTES.remit)
            }}
            email={formData.email!}
            userIsAgent={userIsAgent}
            rsaPin={formData.rsaPin!}
        />}
    </div>
}
export default Page;