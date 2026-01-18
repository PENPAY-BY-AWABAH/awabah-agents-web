"use client";
import { useState } from "react";
import { CopyIcon } from "../assets/copy-icon";
import { FeaturesBtnSection } from "./components/featuresButtonSection";
import { HistorySection } from "./components/history";
import { PerformanceSection } from "./components/performanceSection";
import { WalletBalance } from "./components/walletBalanceSection";
import { CopyToClipboard } from "../includes/functions";
export interface UserDetails {
    firstName?:string;
    lastName?:string;
    accountNumber?:string;
    agentId?:string;
    balance?:number;
}
const Page = ()=>{
    const [details,setDetails] = useState<UserDetails>(
        {
            firstName:"",
            lastName:"",
            agentId:""
        }
    );

    return <div >
        <div className="text-[34px] font-bold">Welcome, {details?.firstName || "User"}!</div>
        <div className="text-[20px] text-[#000000A6] font-normal flex items-center gap-1">{details?.agentId || "000123"} <button 
        onClick={()=>{
            CopyToClipboard(details?.agentId || "000123");
        }}
        className="cursor-pointer">
         <CopyIcon />
         </button></div>
        <WalletBalance />
        <FeaturesBtnSection />
        <PerformanceSection />
        <HistorySection />
    </div>
}
export default Page;