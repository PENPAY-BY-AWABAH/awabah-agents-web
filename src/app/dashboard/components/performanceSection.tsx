"use client"
import { RemitIcon } from "@/app/assets/remite-icon"
import { UserCheckIcon } from "@/app/assets/user-check-icon"
import { UserIcon } from "@/app/assets/user-icon"
import { UserPendingIcon } from "@/app/assets/user-pending-icon"
import { UserRejectIcon } from "@/app/assets/user-reject-icon"
import { UsersIcon } from "@/app/assets/users-icon"
import { WithdrawalIcon } from "@/app/assets/withdrawal-icon"
import { RouteItem, ROUTES } from "@/app/includes/constants"
import useHttpHook from "@/app/includes/useHttpHook"
import { useEffect, useState } from "react"
import { TabSectionProp, UsersStatsProps } from "../users/components/Tabs"

export const PerformanceSection = ()=>{
     const {getAllUserStats} = useHttpHook()
    const [stats,setStats] = useState<UsersStatsProps>({
        rejected:0,
        userRemit:0,
        usersOnboarded:0,
        withdrawal:0
    });
      
      const [btns,setBtns] = useState<TabSectionProp[]>([
            {
            title:"Users Onboarded",
            icon:<UsersIcon size={40} />,
            route:"text-[#1879F8]",
            selected:true,
            description:"3003",
            value:"usersOnboarded"
            },
            {
            title:"Remit",
            icon:<UserCheckIcon />,
            route:"text-[#009668]",
            selected:false,
            description:"3893",
            value:"userRemit"
            },
            {
            title:"Withdrawal History",
            icon:<UserPendingIcon />,
            route:"text-[#F4900C]",
            selected:false,
            description:"390",
            value:"withdrawal"
            },
            {
            title:"Rejected Onboarding",
            icon:<UserRejectIcon />,
            route:"text-[#EE1A1A]",
            selected:false,
            description:"0",
            value:"rejected"
            }
        ])
       
      useEffect(()=>{
        getAllUserStats().then((res)=>{
            if(res.status)
            {
                setStats(res.data)
            }
        })
    },[])
    return <div>
        <div className="text-[24px]" >Performance Overview</div>
        <div className="flex items-center gap-9 my-8 mt-3">
            {btns.map((a,i)=><div key={i} className="bg-[#C4C4C426] grid grid-cols-1 text-center items-center flex-1 rounded-[40px] p-8 min-h-[163px]" >
            <div className={`text-center m-auto ${a.route} `}>{a.icon}</div>
            <div className="text-center text-black text-[28.3px] mt-3">{(stats[a.value!] || 0)}</div>
            <div className="text-center text-black text-[18.8px] mt-3">{a.title}</div>
            </div>)}
        </div>
    </div>
}