"use client"
import { BackIcon } from "@/app/assets/back-icon";
import BaseToggleBtn from "@/app/components/baseCheckBox";
import BaseInput from "@/app/components/baseInput";
import { ROUTES } from "@/app/includes/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
type OnboardingProps = "User Details" | "Bank Details" | "Verification";
interface User {
    name?:string;
    email?:string;
    password?:string;
    fullName?:string;
    address?:string;
    phoneNumber?:string;
    businessName?:string;
    nin?:string;
    bvn?:string;
    dialCode?:string;
}
const Page = ()=>{
    const [section, setSection] = useState<OnboardingProps>("User Details");
    const navigate = useRouter();
    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
    }   
    const [formData, setFormData] = useState<User>({
        email:"",
        fullName:"",
        address:"",
        password:"",
        phoneNumber:"",
        businessName:"",
        nin:"",
        bvn:"",
        dialCode:"+234",
    });
    return <div className="bg-white h-screen fixed top-0 left-0 w-screen z-10 p-4">
       <div className="mb-6">
               <button 
               onClick={()=>{
               navigate.back();
               }}
               className="flex items-center gap-2 cursor-pointer">
                   <BackIcon />
                   <div className="">Back</div>
               </button>
        </div>
         <div className="m-auto items-center text-center   ">
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow w-[500px] p-[30px] pb-[60px]">
                <div className="text-black text-[24px] font-bold text-center">{section}</div>
                <Indicator />
                <div >
                    <div className="text-[#909090] text-[12px] text-left">Please provide some information about the user, these information are used to protect users account and for compliance purpose</div>
                    <form onSubmit={handleSubmit}>
                           <BaseInput
                            type="text"
                            name="name"
                            value={formData.name}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    name: value
                                })
                            }}
                            label="Name"
                            placeholder="Enter name."
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
                            label="Email"
                            placeholder="Enter Email."
                        />
                        <BaseInput
                            required
                            type="password"
                            name="password"
                            value={formData.password}
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    password: value
                                })
                            }}
                            label="Password"
                            placeholder="Enter Password."
                        />
                       
                        <div className="flex items-center justify-center mt-[30px] gap-1">
                            <span className="text-[14px] text-black">Don`t have an account?</span>
                            <Link
                                href={ROUTES.register}
                                className="text-[14px] text-[#009668]"
                            >
                                Create Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}
export default Page;

const Indicator = ()=>{
    return <div className="flex items-center justify-center gap-2 my-6">
        <div className="w-[100px] h-[8px] rounded bg-[#009668]"></div>
        <div className="w-[100px] h-[8px] rounded bg-[#C4C4C4]"></div>
        <div className="w-[100px] h-[8px] rounded bg-[#C4C4C4]"></div>
    </div>
}   