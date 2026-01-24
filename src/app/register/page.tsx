"use client"
import { useRouter } from "next/navigation";
import { BackIcon } from "../assets/back-icon";
import BaseInput from "../components/baseInput";
import { FormEvent, useState } from "react";
import BaseButton from "../components/baseButton";
import { ROUTES } from "../includes/constants";
import Link from "next/link";
import useHttpHook from "../includes/useHttpHook";
import BaseToggleBtn from "../components/baseCheckBox";
import { toast } from "react-toastify";
import { OtpSection } from "./components/otpSection";
type RegisterProps = "Create Account" | "Verify Email" ;
export interface SignUpProps {
email?:string;
firstName?:string;
fullName?:string;
lastName?:string;
password?:string;
phoneNumber?:string;
businessName?:string;
address?:string;
}
const Page = () => {
    const [section, setSection] = useState<RegisterProps>("Create Account")
    const navigate = useRouter();
    const { handleRegister, loading, } = useHttpHook();
    const [formData, setFormData] = useState<SignUpProps>({
        email: "",
        password: ""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const data = {...formData}
        if(formData.fullName){
            const nameParts = formData.fullName.split(" ");
            data.firstName = nameParts[0];
            data.lastName = nameParts.slice(1).join(" ");
        }
        delete data.fullName;
        if(!data.lastName){
           toast.error("Please provide a valid full name")
           return; 
        }
        handleRegister(data).then((res) => {
            if (res.status) {
              setSection("Verify Email")
            }else{
                if(res.data?.activated === "0"){
                  setSection("Verify Email")  
                }
            }
        })
        
    }
    return <div className="bg-white h-full px-[100px] py-[60px]">
        <div className="mb-6">
            <button
                onClick={() => {
                    if(section === "Verify Email")
                    {
                        return setSection("Create Account");
                    }
                    navigate.back();
                }}
                className="flex items-center gap-2 cursor-pointer">
                <BackIcon />
                <div className="text-black text-[18px]">Back</div>
            </button>
        </div>
        <div className="m-auto items-center text-center h-full overflow-x-scroll   ">
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow w-[500px] p-[30px] pb-[60px]">
                <div className="text-black text-[24px] font-bold text-center">{section}</div>
                <div >
                    {section === "Create Account" &&<form onSubmit={handleSubmit}>
                    <div className="text-[#909090] text-[12px] text-left">Fill in your details to register as an Awabah Agent.</div>
                        <BaseInput
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    fullName: value
                                })
                            }}
                            max={80}
                            label="Full Name"
                            placeholder="Enter full name."
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
                            max={30}
                            label="Password"
                            placeholder="Enter Password."
                        />
                    <div className="text-[#009668] text-[14px] text-left mt-4">Minimum of 8 letters and a special character ( *#&)</div>
             <div className="flex items-center gap-3 text-black mb-[30px]">
            <BaseToggleBtn
            onChange={()=>{

            }}
            requred
            type="checkbox"
            value={true}

            />
          <span className="text-[14px] text-black text-left ">By Signing in you agree to our <span className="text-[14px] text-[#B8860B]">terms</span> and <span className="text-[14px] text-[#B8860B]">conditions.</span> Privacy Policy</span>
        </div>
                        <BaseButton
                            loading={loading}
                            text="Next"
                            type="submit"
                        />

                        <div className="flex items-center justify-center mt-[30px] gap-1">
                            <span className="text-[14px] text-black">I have an account?</span>
                            <Link
                                href={ROUTES.login}
                                className="text-[14px] text-[#009668]"
                            >
                            Login
                            </Link>
                        </div>
                    </form>}
                    {section === "Verify Email" && <OtpSection 
                    email={formData?.email || ""}
                    />}
                </div>
            </div>
        </div>
    </div>
}
export default Page;