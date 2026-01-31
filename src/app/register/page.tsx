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
import { RSAPinSection } from "./components/rsaPINRequest";
import { CreatAccounContinue } from "./components/create_account_continue";
import { SuccessComponent } from "../dashboard/user-onboarding/components/success";
import { SuccessSection } from "./components/success";
import { WalletPINSection } from "./components/walletPINSection";
type RegisterProps = "Create Account" | "Verify Email" | "RSA PIN Request" | "Account" | "Wallet Pin" | "Confirm Pin" ;
export interface SignUpProps {
email?:string;
firstName?:string;
fullName?:string;
lastName?:string;
middleName?:string;
password?:string;
phoneNumber?:string;
nin?:string;
businessName?:string;
state?:string;
howDoYouFindUs?:string;
address?:string;
agentId?:string;
}
const Page = () => {
    const [section, setSection] = useState<RegisterProps>("Create Account")
    const [success, setSuccess] = useState<boolean>(false)
    const navigate = useRouter();
    const { handleRegister, loading,ShowMessage } = useHttpHook();
    const [formData, setFormData] = useState<SignUpProps>({
        email: "",
        password: "",
        agentId:""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const data = {...formData}
        if(formData.fullName){
            const nameParts = formData.fullName.split(" ");
            if(nameParts.length !== 3)
            {
                return ShowMessage({message:`full name must contain (first name,middle name & surname)`,position:"center",data:null,status:false,statusCode:0});
            }
            data.firstName = nameParts[0];
            data.middleName = nameParts[1];
            data.lastName = nameParts[2];
        }
        delete data.fullName;
        
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

    return <div className="bg-white h-full p-[16px] lg:px-[100px] lg:py-[60px] overflow-hidden">
        <div className="lg:mb-6 ">
        {!success &&<button
                onClick={() => {
                    if(section === "Verify Email")
                    {
                        return setSection("Create Account");
                    }
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
        </button>}
        </div>
        <div className="m-auto items-center text-center h-full overflow-x-scroll p-[8px]  ">
            <div className="m-auto items-center text-center  rounded-[30px] lg:min-h-[400px] shadow lg:w-[500px] p-[16px] lg:p-[30px] lg:mb-[190px] mb-[120px] ">
                <div className="text-black text-[24px] font-bold text-center">{section}</div>
                <div >
                    {section === "Create Account" && !success &&<form onSubmit={handleSubmit}>
                    <div className="text-[#909090] text-[12px] text-left">Fill in your details to register as an Awabah Agent.</div>
                        <BaseInput
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            required
                            onValueChange={({ value }) => {
                                const splitName = String(value).split(" ")
                                if(splitName.length > 3)
                                {
                                    return
                                }
                                setFormData({
                                    ...formData,
                                    fullName: value
                                })
                            }}
                            max={80}
                            label="Full Name (first name, middle name & surname)"
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
                                    email: String(value).toLowerCase().trim()
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
                    <BaseInput
                            required
                            type="password"
                            name="nin"
                            value={formData.nin}
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    nin: value
                                })
                            }}
                            max={11}
                            label="NIN"
                            placeholder="Enter NIN."
                        />
            <div className="text-[#009668] text-[14px] text-left mt-4">Minimum of 8 letters and a special character ( *#&)</div>
             <div className="flex items-center gap-3 text-black mb-[30px]">
             <div className="w-[30px] h-[30px]">
            <BaseToggleBtn
            onChange={()=>{

            }}
            required
            type="checkbox"
            value={true}

            />
            </div>
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
                    onSuccess={()=>{
                       setSuccess(true)
                       setTimeout(()=>{
                       setSection("Create Account") 
                       },3000)
                    }}
                    />}
                    {section === "RSA PIN Request" && <RSAPinSection
                    onClose={()=>{

                    }}
                    email={formData.email!}
                    onRSAPINRequest={()=>{

                    }}
                    />}
                {section === "Create Account" && success && <CreatAccounContinue
                signUpform={formData}
                onSuccess={(agentId)=>{
                    setFormData({
                                 ...formData,
                                 agentId
                                })
                    setSection("Account")
                }}
                />}
                {section === "Account" && <SuccessSection 
                signUpForm={formData}
                onClose={()=>{

                }}
                onContinue={()=>{
                   setSection("Wallet Pin") 
                }}
                />}
                {section === "Wallet Pin" && <WalletPINSection 
                signUpForm={formData}
                onSuccess={()=>{
                   setSection("Confirm Pin") 
                }}
                />}
                </div>
            </div>
        </div>
    </div>
}
export default Page;