"use client"
import { useRouter } from "next/navigation";
import { BackIcon } from "../assets/back-icon";
import BaseInput from "../components/baseInput";
import BaseToggleBtn from "../components/baseCheckBox";
import { FormEvent, useState } from "react";
import BaseButton from "../components/baseButton";
import { CONSTANT, ROUTES } from "../includes/constants";
import Link from "next/link";
import useHttpHook from "../includes/useHttpHook";
import { LoginProps } from "../includes/types";
import { OtpSection } from "./components/otpSection";

const Page = ()=>{
    const navigate = useRouter();
    const {handleSendOtp,loading} = useHttpHook();
     const [showPasswordSection,setPasswordSection] = useState<boolean>(false);
    const [formData,setFormData] = useState<LoginProps>({
        email:"",
        password:""
    })
    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        localStorage.setItem(CONSTANT.LocalStore.resetPassword,formData.email!);
        handleSendOtp(formData.email!).then((res)=>{
            if(res.status)
            {
              setPasswordSection(true)
            }
        })
    }
    return <div className="bg-white min-h-full p-[16px] lg:px-[100px] lg:py-[60px]">
     <div className="mb-6">
             <button 
             onClick={()=>{
             navigate.back();
             }}
             className="flex items-center gap-2 cursor-pointer">
               <span className="hidden lg:block" >
                 <BackIcon  />
                 </span>
                 <span className="lg:hidden">
                 <BackIcon size={30}  />
                 </span>
                 <div className="text-black text-[18px]">Back</div>
             </button>
    </div>
    <div className="m-auto items-center text-center   ">
      {!showPasswordSection?<div  className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow lg:w-[500px] p-[16px] lg:p-[30px] pb-[60px] ">
      <div className="text-black text-[24px] text-center ">Forgot Password</div>
      <div className="text-[#000000A6] text-[12px] font-normal text-center mb-4 mt-4 w-[80%] m-auto">Please enter your email to get an OTP code to change your password</div>
      <form onSubmit={handleSubmit}>
        <BaseInput 
        type="text"
        name="email"
        value={formData.email}
        required
        onValueChange={({value})=>{
            setFormData({
                ...formData,
                email:value
            })
        }}
        label="Email"
        placeholder="Enter Email."
        className="mb-5 "

        />
        <BaseButton
        loading={loading}
        text="Get Code"
        type="submit"
        />
      </form>
     </div>:<div  className="m-auto items-center text-center  rounded-[30px] lg:min-h-[400px] shadow lg:w-[500px] lg:p-[30px] pb-[60px] ">
    <OtpSection />
    </div>}
     </div>
    </div>
}
export default Page;