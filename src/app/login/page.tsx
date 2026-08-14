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
import { ReturnAllNumbers } from "../includes/functions";

const REMEMBER_ME_KEY = `${CONSTANT.LocalStore.token || "awabah"}_remember_me`;

const readInitialRemember = (): { email: string; remember: boolean } => {
    if (typeof window === "undefined") return { email: "", remember: false };
    try {
        const raw = localStorage.getItem(REMEMBER_ME_KEY);
        if (!raw) return { email: "", remember: false };
        const parsed = JSON.parse(raw);
        return {
            email: typeof parsed?.email === "string" ? parsed.email : "",
            remember: Boolean(parsed?.remember),
        };
    } catch {
        return { email: "", remember: false };
    }
};

const Page = () => {
    const [showAccountSwitch, setShowAccountSwitch] = useState<boolean>(false)
    const navigate = useRouter();
    const { handleLogin,handleLoginWithNIN, loading } = useHttpHook();

    const initial = readInitialRemember();
     
    const [formData, setFormData] = useState<LoginProps>({
        email: initial.email,
        password: ""
    })
    const [showOTP, setShowOTP] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(initial.remember);
    const isNINInput = /^[0-9]/.test(formData.email ?? "")

    const handlePostLogin = (res: Awaited<ReturnType<typeof handleLogin>>) => {
        if (res.message.includes("OTP")) {
            return setShowOTP(true);
        }
        if (res?.data?.other_info_not_saved) {
            localStorage.setItem(CONSTANT.LocalStore.registrationForm, JSON.stringify(res.data));
            return navigate.replace(`${ROUTES.register}?step=2`);
        }
        if (res.data?.transaction_pin_not_saved) {
            localStorage.setItem(CONSTANT.LocalStore.registrationForm, JSON.stringify(res.data));
            return navigate.replace(`${ROUTES.register}?step=3`);
        }
        if (res.status) {
            if (rememberMe) {
                localStorage.setItem(
                    REMEMBER_ME_KEY,
                    JSON.stringify({ email: formData.email, remember: true })
                );
            } else {
                localStorage.removeItem(REMEMBER_ME_KEY);
            }
            navigate.replace(ROUTES.dashboard);
        } else {
            if (res.data?.switch_account) {
                setShowAccountSwitch(true);
            }
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isNINInput) {
            return handleLoginWithNIN({
                password: formData.password,
                nin: formData.email,
            }).then(handlePostLogin);
        }
        handleLogin(formData).then(handlePostLogin);
    };

    useEffect(() => {
        const token = localStorage.getItem(CONSTANT.LocalStore.token);
        if (token) {
            return navigate.replace(ROUTES.dashboard);
        }
    }, [navigate]);

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
                        name={isNINInput ? "nin" : "email"}
                        value={formData.email}
                        required
                        onValueChange={({ value }) => {
                            if(isNINInput)
                            {
                                setFormData({
                                    ...formData,
                                    email: ReturnAllNumbers(String(value).trim())
                                })
                            }else{
                                setFormData({
                                    ...formData,
                                    email: String(value).trim().toLowerCase()
                                })
                            }
                        }}
                        max={isNINInput?11:100}
                        label={isNINInput ? "NIN" : "Email"}
                        placeholder={isNINInput ? "Enter your 11-digit NIN." : "Enter Email."}
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
                                setRememberMe((prev) => !prev);
                            }}
                            type="checkbox"
                            value={rememberMe}
                        />
                        <span className="text-[14px]">Remember me</span>
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
                        <span className="text-[14px] text-black">Don&apos;t have an account?</span>
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
