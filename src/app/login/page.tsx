"use client"
import { useRouter } from "next/navigation";
import { BackIcon } from "../assets/back-icon";
import BaseInput from "../components/baseInput";
import BaseToggleBtn from "../components/baseCheckBox";
import { FormEvent, useEffect, useState } from "react";
import BaseButton from "../components/baseButton";
import { CONSTANT, ROUTES } from "../includes/constants";
import Link from "next/link";
import useHttpHook from "../includes/useHttpHook";
import { LoginProps } from "../includes/types";
import { SwitchAccount } from "./components/switch-account";
import { HandleResetData } from "./components/handleReset";
import { OtpSection } from "./components/otp-screen";
import { ReturnMobile } from "../includes/functions";

const Page = () => {
    const [showAccountSwitch, setShowAccountSwitch] = useState<boolean>(false)
    const navigate = useRouter();
    const { handleLogin,handleLoginWithNIN, loading } = useHttpHook();
     
    const [formData, setFormData] = useState<LoginProps>({
        email: "",
        password: ""
    })
    const [showOTP, setShowOTP] = useState<boolean>(false);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if(isNINInput)
        {
          return handleLoginWithNIN({
            password: formData.password,
            nin: formData.email
        }).then((res) => {
            if (res.message.includes("OTP")) {
               return setShowOTP(true)
            }
             if (res?.data?.other_info_not_saved) {
                localStorage.setItem(CONSTANT.LocalStore.registrationForm,JSON.stringify(res.data))
                return navigate.replace(`${ROUTES.register}?step=2`)
            }
            
             if (res.data?.transaction_pin_not_saved) {
                 localStorage.setItem(CONSTANT.LocalStore.registrationForm,JSON.stringify(res.data))
                return navigate.replace(`${ROUTES.register}?step=3`)
            }
          
            if (res.status) {
                navigate.replace(ROUTES.dashboard)
            } else {
                if (res.data?.switch_account) {
                    setShowAccountSwitch(true)
                }
            }
        })  
        }
        handleLogin(formData).then((res) => {
            if (res.message.includes("OTP")) {
               return setShowOTP(true)
            }
             if (res?.data?.other_info_not_saved) {
                localStorage.setItem(CONSTANT.LocalStore.registrationForm,JSON.stringify(res.data))
                return navigate.replace(`${ROUTES.register}?step=2`)
            }
            
             if (res.data?.transaction_pin_not_saved) {
                 localStorage.setItem(CONSTANT.LocalStore.registrationForm,JSON.stringify(res.data))
                return navigate.replace(`${ROUTES.register}?step=3`)
            }
          
            if (res.status) {
                navigate.replace(ROUTES.dashboard)
            } else {

                if (res.data?.switch_account) {
                    setShowAccountSwitch(true)
                }

            }
        })
    }
    useEffect(() => {
        const token = localStorage.getItem(CONSTANT.LocalStore.token);
        if (token) {
            // navigate.replace(ROUTES.dashboard) 
        }
    }, [])
     let isNINInput = false;
     if(formData.email?.length !== 0)
     {
     isNINInput = /^[0-9]+$/.test(formData.email![0])
     }
    return <div className="bg-white min-h-full lg:px-[100px] p-[16px] lg:py-[60px] overflow-hidden">
        <div className="mb-6">
            <button
                onClick={() => {
                    navigate.back();
                }}
                className="flex items-center gap-2 cursor-pointer ">
                <span className="hidden lg:block" >
                    <BackIcon />
                </span>
                <span className="lg:hidden">
                    <BackIcon size={30} />
                </span>
                <div className="text-black text-[18px]">Back</div>
            </button>
        </div>
        <div className="m-auto items-center text-center overflow-scroll px-[8px] pb-[8px] ">
            <div className="m-auto items-center text-center rounded-[30px] lg:min-h-[400px] shadow lg:w-[500px] px-[16px]  lg:p-[30px] pb-[20px]  lg:pb-[60px]">
                <div className="text-black text-[24px] font-bold text-center">Login</div>
                <form onSubmit={handleSubmit} >
                    <BaseInput
                        type={isNINInput?"text":"email"}
                        name={"email"}
                        value={formData.email}
                        required
                        onValueChange={({ value }) => {
                            if(isNINInput)
                            {
                                setFormData({
                                    ...formData,
                                    email: ReturnMobile(String(value).trim())
                                })
                            }else{
                                setFormData({
                                    ...formData,
                                    email: String(value).trim().toLowerCase()
                                })
                            }
                        }}
                        max={isNINInput?11:100}
                        label="Email or NIN"
                        placeholder="Enter Email or NIN."
                    />
                    <BaseInput
                        required
                        type="password"
                        name="password"
                        value={formData.password}
                        onValueChange={({ value }) => {
                            setFormData({
                                ...formData,
                                password: String(value).trim()
                            })
                        }}
                        label="Password"
                        placeholder="Enter Password."
                    />
                    <div className="flex items-center gap-3 text-black mb-[30px]">
                        <BaseToggleBtn
                            onChange={() => {

                            }}
                            type="checkbox"
                            value={true}

                        />
                        <span className="text-[14px">Remember me</span>
                        <div className="flex items-center justify-end flex-1">
                            <Link
                                href={ROUTES.forgotPassword}
                                className="text-emerald-600 text-[14px] cursor-pointer"
                            >
                                Forgot Password
                            </Link>
                        </div>
                    </div>
                    <BaseButton
                        loading={loading}
                        text="Log in"
                        type="submit"
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
                <div className="mt-5" >
                 <Link
                  href={"https://onboarding.awabah.com/generate-rsa-pin"}
                  className="text-[14px] text-[#009668] "
                  >
                I want to register myself
                  </Link>
                  </div>
                <HandleResetData
                />
            </div>
        </div>
        {showOTP && <OtpSection
            onClose={() => {
                setShowOTP(false);
                const user =  localStorage.getItem(CONSTANT.LocalStore.registrationForm);
                if(user)
                {
                  const userData = JSON.parse(user)
                  if(userData?.other_info_not_saved)
                  {
                   return navigate.replace(`${ROUTES.register}?step=2`)
                  }
                  if(userData?.transaction_pin_not_saved)
                  {
                   return navigate.replace(`${ROUTES.register}?step=3`)
                  }
                }
            }}
            email={formData.email!}
        />}
        {showAccountSwitch && <SwitchAccount
            email={formData.email!}
            password={formData.password!}
            onClose={() => setShowAccountSwitch(false)}
        />}
    </div>
}
export default Page;