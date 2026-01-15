"use client"
import { RemitIcon } from "@/app/assets/remite-icon"
import { UserCheckIcon } from "@/app/assets/user-check-icon"
import { UserIcon } from "@/app/assets/user-icon"
import { UserPendingIcon } from "@/app/assets/user-pending-icon"
import { UserRejectIcon } from "@/app/assets/user-reject-icon"
import { UsersIcon } from "@/app/assets/users-icon"
import { WithdrawalIcon } from "@/app/assets/withdrawal-icon"
import { RouteItem, ROUTES } from "@/app/includes/constants"
import { useState } from "react"

export const PerformanceSection = ()=>{
      const [btns,setBtns] = useState<RouteItem[]>([
            {
            title:"Users Onboarded",
            icon:<UsersIcon size={40} />,
            route:"text-[#1879F8]",
            selected:true,
            description:"3003"
            },
            {
            title:"Remit",
            icon:<UserCheckIcon />,
            route:"text-[#009668]",
            selected:false,
            description:"3893"
            },
            {
            title:"Withdrawal History",
            icon:<UserPendingIcon />,
            route:"text-[#F4900C]",
            selected:false,
            description:"390"
            },
            {
            title:"Rejected Onboarding",
            icon:<UserRejectIcon />,
            route:"text-[#EE1A1A]",
            selected:false,
            description:"0"
            }
        ])
        
    return <div>
        <div className="text-[24px]" >Performance Overview</div>
        <div className="flex items-center gap-9 my-8 mt-3">
            {btns.map((a,i)=><div key={i} className="bg-[#C4C4C426] grid grid-cols-1 text-center items-center flex-1 rounded-[40px] p-8 min-h-[163px]" >
            <div className={`text-center m-auto ${a.route} `}>{a.icon}</div>
            <div className="text-center text-black text-[28.3px] mt-3">{a.description!}</div>
            <div className="text-center text-black text-[18.8px] mt-3">{a.title}</div>
            </div>)}
        </div>
    </div>
}