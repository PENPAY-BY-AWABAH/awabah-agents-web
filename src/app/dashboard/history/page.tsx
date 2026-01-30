"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { HistorySection } from "../components/history";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useHttpHook from "@/app/includes/useHttpHook";
export interface TransactionItem {
    title?:string
}
const Page = ()=>{
    
    const navigate = useRouter();
    
    return <div >
        <div className="mb-6">
        <button 
        onClick={()=>{
        navigate.back();
        }}
        className="flex items-center gap-2 cursor-pointer">
            <span className="hidden lg:block" >
                    <BackIcon />
                </span>
                <span className="lg:hidden">
                    <BackIcon size={30} />
                </span>
            <div className="">Back</div>
        </button>
        </div>
        <HistorySection page={true} />
    </div>
}
export default Page;