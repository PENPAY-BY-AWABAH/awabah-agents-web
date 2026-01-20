"use client"
import { useRouter } from "next/navigation";
import { BackIcon } from "../assets/back-icon";
import BaseInput from "../components/baseInput";
import BaseToggleBtn from "../components/baseCheckBox";
import { FormEvent, useState } from "react";
import BaseButton from "../components/baseButton";
import { ROUTES } from "../includes/constants";
import Link from "next/link";
import useHttpHook from "../includes/useHttpHook";
import { LoginProps } from "../includes/types";
import { toast } from "react-toastify";
type RegisterProps = "User Details" | "Verify Email" | "Account";
export interface SignUpProps {
email?:string;
firstName?:string;
lastName?:string;
password?:string;
phoneNumber?:string;
businessName?:string;
nin?:string;
}
const Page = () => {
    const [section, setSection] = useState<RegisterProps>("User Details")
    const navigate = useRouter();
    const { handleRegister, loading, } = useHttpHook();
    const [formData, setFormData] = useState<SignUpProps>({
        email: "",
        password: ""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleRegister(formData).then((res) => {
            if (res.status) {
                navigate.replace(ROUTES.login)
            }
        })
    }
    return <div className="bg-white h-full px-[100px] py-[60px]">
        <div className="mb-6">
            <button
                onClick={() => {
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
                            name="businessName"
                            value={formData.businessName}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    businessName: value
                                })
                            }}
                            max={140}
                            label="Business Name"
                            placeholder="Enter business name."
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
                    </form>
                </div>
            </div>
        </div>
    </div>
}
export default Page;