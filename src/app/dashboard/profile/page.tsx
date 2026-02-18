/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"
import { ApprovedIcon, PendingIcon } from "../components/users";
import { TabSection } from "./components/Tabs";
import { FormEvent, useEffect, useState } from "react";
import useHttpHook from "@/app/includes/useHttpHook";
import { UserDetails } from "../page";
import { CopyToClipboard } from "@/app/includes/functions";
import { CopyIcon } from "@/app/assets/copy-icon";
import BaseInput from "@/app/components/baseInput";
import BaseButton from "@/app/components/baseButton";
import { ChangePasswordIcon } from "@/app/assets/change-password-icon";
import { ChevronRightIcon } from "@/app/assets/chevron-right";
import { ChangeTransactionPinIcon } from "@/app/assets/change-txt-pin";
import { PasswordModal } from "./components/password-modal";
import { TxtPINModal } from "./components/txt-pin-modal";
import { LogoutModal } from "./components/logout-modal";
import { SaveProfileModal } from "./components/save-profile-modal";
import BaseSelect from "@/app/components/baseSelect";
import { ItemProps } from "@/app/includes/types";
import { AvatarSection } from "./components/avatar-section";
import { UserIcon } from "@/app/assets/user-p-icon";

const Page = () => {
    const { getAgentProfile } = useHttpHook();
    const [formData, setFormData] = useState<UserDetails>({
        firstName: "",
        lastName: "",
        agentId: "",
        phoneNumber: "",
        createdAt: "",
        activated: "",
        accountType: "",
        rsaNumber: "",
        avatar: "",
        address: "",
        state: ""
    })
    const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [showSaveProfile, setShowSaveProfile] = useState<boolean>(false);
    const [showTransactionPINChange, setShowTransactionPINChange] = useState<boolean>(false);
    const [details, setDetails] = useState<UserDetails>(
        {
            firstName: "",
            lastName: "",
            agentId: "",
            phoneNumber: "",
            createdAt: "",
            activated: "",
            accountType: "",
            rsaNumber: "",
            avatar: "",
            fullName: ""
        }
    );
    const GetProfile = () => {
        getAgentProfile().then((res) => {
            if (res.status) {
                setDetails({
                    ...res.data,
                    fullName: res.data.firstName + " " + res.data.lastName,
                    phoneNumber: String(res.data.phoneNumber).replace("+234", "0")
                })
                setFormData({
                    ...res.data,
                    fullName: res.data.firstName + " " + res.data.lastName,
                    phoneNumber: String(res.data.phoneNumber).replace("+234", "0")
                })
            }
        })
    }

    useEffect(() => {
        GetProfile();
    }, [])
    const ifChanges = details.fullName !== formData.fullName || details.phoneNumber !== formData.phoneNumber || details.address !== formData.address || details.state !== formData.state

    const handleUpdateProfile = (e: FormEvent) => {
        e.preventDefault()
        setShowSaveProfile(ifChanges)
    }


    return <div className="">
        <div className="flex items-center gap-3">
            <UserIcon />
            <div className="text-[20px] font-medium lg:text-[32px]">Profile</div>
        </div>
        <div className="bg-[#C4C4C426] p-[16px] lg:p-[30px] rounded-[15px] my-[16px] lg:my-[20px]">
                <div className="flex items-center gap-3 lg:gap-5">
                       <AvatarSection
                        details={details}
                        onReloadProfile={()=>{
                            GetProfile()
                        }}
                        />
                        <div className="flex-glow text-[14px] lg:text-[16px]" >
                            <div className="text-[#000000]  ">Agent Name: <span className="font-bold hidden lg:block">{details.firstName} {details.lastName}</span></div>
                            <div className="text-[#000000] font-bold lg:hidden ">{details.firstName} {details.lastName}</div>
                            <div className="text-[#000000] mt-[5px] flex item-center gap-[2px]">Agent ID: <span className="font-bold flex item-center gap-[2px] hidden lg:block">{details.agentId} <button
                                onClick={() => {
                                    CopyToClipboard(String(details?.agentId));
                                }}
                                className="cursor-pointer mt-[-10px]">
                                <CopyIcon />
                            </button></span></div>
                            <div className="text-[#000000] mt-[0px] flex item-center gap-[2px] lg:hidden "><span className="font-bold flex item-center gap-[2px]">{details.agentId} <button
                                onClick={() => {
                                    CopyToClipboard(String(details?.agentId));
                                }}
                                className="cursor-pointer mt-[-5px] ms-[10px]">
                                <CopyIcon />
                            </button></span></div>
                            <div className="flex mt-[5px] text-[#000000] gap-[4px] " >
                                <span>Status Badge: </span>
                                {String(details?.activated) === "1" ? <div className="flex text-[10px] gap-1 items-center bg-[#00A55826] text-[#00A558] rounded-[30px] px-2 py-1" >
                                    <ApprovedIcon />
                                    <div>Approved</div>
                                </div> : <div className="flex text-[10px] gap-1 items-center bg-[#F4900C26] text-[#F4900C] rounded-[30px] px-2 py-1" >
                                    <PendingIcon />
                                    <div >Pending</div>
                                </div>}
                            </div>
                        </div>
                </div>
        </div>
        <div className="bg-[#C4C4C426] p-[15px] rounded-[15px] my-[20px]">
            <div className="text-[18px] font-medium lg:text-[24px]">Performance Overview</div>
            <TabSection />
        </div>
        <div className="bg-[#C4C4C426] p-[15px] rounded-[15px] my-[20px]">
            <div className="text-[18px] font-medium lg:text-[24px]">Personal Information</div>
            <form
                onSubmit={handleUpdateProfile}
            >
                <BaseInput
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    required
                    onValueChange={({ value }) => {
                        if (String(value).split(" ").length > 2) {
                            return;
                        }
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
                    name="email"
                    disabled
                    value={formData.email}
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
                    type="text"
                    name="location"
                    value={formData.address}
                    onValueChange={({ value }) => {
                        setFormData({
                            ...formData,
                            address: value
                        })
                    }}
                    max={30}
                    label="Address"
                    placeholder="Address"
                />
                <div className="w-[230px] mb-5 text-left" >
                <BaseSelect
                    value={formData.state!}
                    required
                    list={[
                        "Abia",
                        "Adamawa",
                        "Akwa Ibom",
                        "Anambra",
                        "Bauchi",
                        "Bayelsa",
                        "Benue",
                        "Borno",
                        "Cross River",
                        "Delta",
                        "Ebonyi",
                        "Edo",
                        "Ekiti",
                        "Enugu",
                        "FCT - Abuja",
                        "Gombe",
                        "Imo",
                        "Jigawa",
                        "Kaduna",
                        "Kano",
                        "Katsina",
                        "Kebbi",
                        "Kogi",
                        "Kwara",
                        "Lagos",
                        "Nasarawa",
                        "Niger",
                        "Ogun",
                        "Ondo",
                        "Osun",
                        "Oyo",
                        "Plateau",
                        "Rivers",
                        "Sokoto",
                        "Taraba",
                        "Yobe",
                        "Zamfara"
                    ].map((state)=>{
                        return {
                            title:state,
                            description:state
                        }
                    }) as unknown as ItemProps[]}
                    custom
                    name="state"
                    onValueChange={(value) => {
                        setFormData({
                            ...formData,
                            state: value.title
                        })
                    }}
                    label="State"
                    placeholder="State"
                />
                </div>
                <div className="w-[150px] mb-[20px]" >
                    <BaseButton
                        disabled={!ifChanges}
                        text={ifChanges ? "Save Changes" : "Edit Profile"}
                        type="submit"
                        white={!ifChanges}
                    />
                </div>
            </form>
        </div>
        <div className="bg-[#C4C4C426] p-[15px] rounded-[15px] my-[20px] ">
            <div className="text-[24px]">Personal Information</div>
            <div
            >
                <button
                    onClick={() => {
                        setShowPasswordChange(true)
                    }}
                    className="flex item-center gap-3 p-2 bg-white rounded-[12px] shadow-[0.5px] w-full mt-4 cursor-pointer"
                >
                    <div
                        className="flex flex-grow item-center gap-3 "
                    >
                        <ChangePasswordIcon />
                        <span className="text-[16px] text-[#000000A6]" >Change Password</span>
                    </div>
                    <ChevronRightIcon />
                </button>
                <button
                    onClick={() => {
                        setShowTransactionPINChange(true)
                    }}
                    className="flex item-center gap-3 p-2 bg-white rounded-[12px] shadow-[0.5px] w-full mt-4 cursor-pointer"
                >
                    <div
                        className="flex flex-grow item-center gap-3 "
                    >
                        <ChangeTransactionPinIcon />
                        <span className="text-[16px] text-[#000000A6]" >Change Transaction PIN</span>
                    </div>
                    <ChevronRightIcon />
                </button>
            </div>
        </div>
        <div className="bg-[#C4C4C426] p-[15px] rounded-[15px] my-[20px] mb-[120px]">
            <div className="text-[24px]">Log Out</div>
            <div
                className="w-[150px] mt-[20px]"
            >
                <BaseButton
                    type="button"
                    onClick={() => {
                        setShowLogin(true)
                    }}
                    text="Logout"
                />
            </div>
            <div className="text-[16px] text-[#000000A6] mt-[20px]" >You’ll need your login details to sign in again.</div>
        </div>
        {showPasswordChange && <PasswordModal
            details={details}
            onClose={() => setShowPasswordChange(false)}
        />}
        {showTransactionPINChange && <TxtPINModal
            details={details}
            onClose={() => setShowTransactionPINChange(false)}
        />}
        {showLogin && <LogoutModal
            onClose={() => setShowLogin(false)}
            details={details}
        />}
        {showSaveProfile && <SaveProfileModal
            onClose={() => setShowSaveProfile(false)}
            details={formData}
        />}
    </div>
}
export default Page;
