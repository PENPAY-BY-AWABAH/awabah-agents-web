/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { CopyIcon } from "../assets/copy-icon";
import { FeaturesBtnSection } from "./components/featuresButtonSection";
import { HistorySection } from "./components/history";
import { PerformanceSection } from "./components/performanceSection";
import { WalletBalance } from "./components/walletBalanceSection";
import { CopyToClipboard } from "../includes/functions";
import useHttpHook from "../includes/useHttpHook";
import { placeHolderAvatar } from "../includes/constants";
export interface UserDetails {
    firstName?: string;
    lastName?: string;
    accountNumber?: string;
    agentId?: string;
    id?: string;
    email?: string;
    phoneNumber: string;
    createdAt: string;
    activated: string;
    accountType: string;
    rsaNumber: string;
    sex?: string;
    dob?: string;
    maritalStatus?: string;
    maidenName?: null;
    placeOfBirth?: null;
    nationality?: string;
    stateOfOrigin?: string;
    lGAOfOrigin?: string;
    fatherFirstName?: null;
    fatherLastName?: null;
    address?: string;
    villageTownCity?: null;
    zipCode?: null;
    state?:string;
    countryResidenceCode?: null;
    pobox?: null;
    stateCode?: null;
    cityCode?: null;
    lga?: string;
    pensionProviderName?: string;
    pensionProviderCode?: string;
    isAgent?: boolean;
    nextOfKinRegistered?: boolean;
    employerDetailsRegistered?: boolean;
    avatar?: string;
    fullName?:string;
}
const Page = () => {
    const { getAgentProfile } = useHttpHook()
    const [details, setDetails] = useState<UserDetails>(
        {
            firstName: "",
            lastName: "",
            agentId: "",
            phoneNumber: "",
            createdAt: "",
            activated: "",
            accountType: "",
            rsaNumber: ""
        }
    );
    const GetProfile = () => {
        getAgentProfile().then((res) => {
            if (res.status) {
                setDetails(res.data)
            }
        })
    }
    useEffect(() => {
        GetProfile();
    }, [])
    return <div >
        <div className="flex item-center gap-2">
         <div className="lg:hidden h-[55px] w-[55px] bg-[#C4C4C459] border-[0.5px] rounded-[55px] overflow-hidden" >
            <img src={details.avatar?details.avatar:placeHolderAvatar.src}
                alt={"oo"}
                className="h-full w-full"/>
        </div>
        <div className="flex-grow">
        <div className="text-[18px] lg:text-[34px] font-bold">Welcome, {details?.firstName || "User"}!</div>
        <div className="text-[14px] lg:text-[20px]  text-[#000000A6] font-normal flex items-center gap-1">{details?.agentId} <button
            onClick={() => {
                CopyToClipboard(String(details?.agentId));
            }}
            className="cursor-pointer">
            <CopyIcon />
        </button>
        </div>
        </div>
        </div>
        <WalletBalance />
        <FeaturesBtnSection />
        <PerformanceSection />
        <HistorySection />
    </div>
}
export default Page;