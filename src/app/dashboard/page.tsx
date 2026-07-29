/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { FeaturesBtnSection } from "./components/featuresButtonSection";
import { HistorySection } from "./components/history";
import { PerformanceSection } from "./components/performanceSection";
import { ShareModal } from "./components/shareModal";
import { WalletBalance } from "./components/walletBalanceSection";
import useCommissionStore from "../includes/store";
import useHttpHook from "../includes/useHttpHook";
import { placeHolderAvatar } from "../includes/constants";
import Link from "next/link";
import { BellIcon } from "../assets/bell-icon";
import { Share2Icon } from "lucide-react";
import RegisterOptions from "./components/registerOptions";
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
    const { userDetails, update } = useCommissionStore()
    const details = userDetails as UserDetails
    const [showShareModal, setShowShareModal] = useState(false);
 
    useEffect(() => {
        getAgentProfile().then((res) => {
            if (res.status) {
                update({
                    userDetails: {
                        ...res.data,
                        fullName: `${res.data.firstName || ""} ${res.data.lastName || ""}`.trim(),
                        phoneNumber: String(res.data.phoneNumber).replace("+234", "0")
                    }
                })
            }
        })
    }, [update])
    return <div >
        <div className="flex item-center gap-2">
         <div className="lg:hidden h-[55px] w-[55px] bg-[#C4C4C459] border-[0.5px] rounded-[55px] overflow-hidden" >
            <img src={details.avatar?details.avatar:placeHolderAvatar.src}
                alt={"oo"}
                className="h-full w-full"/>
        </div>
        <div className="flex-grow">
        <div className="text-[18px] lg:text-[34px] font-bold">Welcome, {details?.firstName || "User"}!</div>
        <div className="text-[14px] lg:text-[20px]  text-[#000000A6] font-normal flex items-center gap-2">
        {details?.agentId} 
        <button
            onClick={()=>setShowShareModal(true)}
            className="cursor-pointer">
            <Share2Icon color="green" />
        </button>
        </div>
         <div >
            <small className="text-[12px] lg:text-[16px] text-[#00000087] font-normal">Share your referral code to invite others to register their RSA PIN.</small>
        </div>
        </div>
        <div className="lg:hidden flex-1 gap-1 flex text-center items-center justify-center">
        <Link 
        href={"#"} 
        className="flex-1 gap-1 flex text-center items-center justify-center"  >
        <BellIcon />
        </Link>
        </div>
        </div>
        <WalletBalance />
        <FeaturesBtnSection />
        <PerformanceSection />
        <HistorySection />
        <RegisterOptions />
        {showShareModal && <ShareModal
            onClose={() => setShowShareModal(false)}
        />}
    </div>
}
export default Page;
