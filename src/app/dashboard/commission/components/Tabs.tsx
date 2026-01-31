import { CommissionEarnIcon } from "@/app/assets/commision-earn-icon"
import { CommissionWithdrawalIcon } from "@/app/assets/commision-withdrawal-icon"
import { OpenWalletIcon } from "@/app/assets/open-wallet-icon"
import { UserCheckIcon } from "@/app/assets/user-check-icon"
import { UserPendingIcon } from "@/app/assets/user-pending-icon"
import { UserRejectIcon } from "@/app/assets/user-reject-icon"
import { UsersIcon } from "@/app/assets/users-icon"
import { NairaSymbol } from "@/app/includes/constants"
import { ReturnComma } from "@/app/includes/functions"
import useHttpHook from "@/app/includes/useHttpHook"
import { ReactElement, useEffect, useState } from "react";

type CommissionStatsType = "commissionEarn" | "withdrawals" | "balance" ;
interface TabSectionProp {
    title:string;
    icon?:string | ReactElement;
    description?:string;
    bgColour?:string;
    borderColour?:string;
    route?:string;
    value?:CommissionStatsType;
    selected?:boolean;
}
export interface CommissionStatsProps {
  commissionEarn: number;
  withdrawals: number;
  balance: number;
}

export const TabSection = ()=>{
    const {getAllCommisionStats} = useHttpHook()
    const [stats,setStats] = useState<CommissionStatsProps>({
        commissionEarn:0,
        withdrawals:0,
        balance:0,
    });
      const [btns,setBtns] = useState<TabSectionProp[]>([
            {
            title:"Commission Earned",
            icon:<CommissionEarnIcon size={40} />,
            route:"text-[#1879F8]",
            selected:true,
            bgColour:"bg-white",
            borderColour:"border-[#1879F8]",
            value:"commissionEarn"
            },
            {
            title:"Available Balance",
            icon:<OpenWalletIcon />,
            route:"text-[#009668]",
            selected:false,
            bgColour:"bg-white",
            borderColour:"border-[#009668]",
            description:"3893",
            value:"balance"
            },
            {
            title:"Withdrawn",
            icon:<CommissionWithdrawalIcon />,
            route:"text-[#F4900C]",
            selected:false,
            bgColour:"bg-white",
            borderColour:"border-[#F4900C]",
            description:"390",
            value:"withdrawals"
            }
        ])
    useEffect(()=>{
        getAllCommisionStats().then((res)=>{
            if(res.status)
            {
                setStats(res.data)
            }
        })
    },[])
    return <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-[16px] lg:gap-9 lg:my-8 mt-[16px]">
            {btns.map((a,i)=><div key={i} className={`bg-[#C4C4C426] shadow grid grid-cols-1 text-center items-center flex-1 rounded-[20px] lg:rounded-[40px] p-[16px] lg:p-8 min-h-[163px]`} >
            <div className={`text-center m-auto ${a.route} ${String(a.borderColour).replace("border","text")} `}>{a.icon}</div>
            <div className="text-center text-black font-medium text-[20px] lg:text-[28.3px] mt-3">{a.value !== "withdrawals"?NairaSymbol:""}{String(stats[a.value!]) === "0"?"0":ReturnComma(String(stats[a.value!] || 0))}</div>
            <div className="text-center text-black text-[14px] lg:text-[18.8px] mt-3">{a.title}</div>
            </div>)}
        </div>
    </div>
}