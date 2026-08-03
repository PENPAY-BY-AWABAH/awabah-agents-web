"use client"
import { useRouter } from "next/navigation";
import { TabSection } from "./components/Tabs";
import { CommissionSection } from "../components/commission";
import { CommissionWalletBalance } from "./components/walletBalanceSection";
import { CommissionIcon } from "@/app/assets/commision-icon";

const Page = ()=>{
return <div className="mb-6">
        <div className="flex items-center gap-3">
            <CommissionIcon />
            <div className="text-[20px] font-medium lg:text-[32px] text-black">Commission</div>
        </div>
        <CommissionWalletBalance />
         <div className="text-[18px] font-medium lg:text-[24px] mt-[16px] lg:mt-[40px]">Commission Overview</div>
        <TabSection />
        <CommissionSection page={true} />
    </div>
}
export default Page;
