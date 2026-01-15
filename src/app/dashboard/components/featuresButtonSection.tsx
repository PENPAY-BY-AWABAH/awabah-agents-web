"use client"
import { RemitIcon } from "@/app/assets/remite-icon";
import { UserIcon } from "@/app/assets/user-icon";
import { UsersIcon } from "@/app/assets/users-icon";
import { WithdrawalIcon } from "@/app/assets/withdrawal-icon";
import { COLOURS, RouteItem, ROUTES } from "@/app/includes/constants"
import useHttpHook from "@/app/includes/useHttpHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
export interface WalletBalanceProps {
balance:string;
earnings?:string;
}
export const FeaturesBtnSection =()=>{
    
    const [btns,setBtns] = useState<RouteItem[]>([
        {
        title:"Onboard User",
        icon:<UserIcon />,
        route:ROUTES.userOnboarding,
        selected:true
        },
        {
        title:"Remit",
        icon:<RemitIcon />,
        route:ROUTES.remit,
        selected:false
        },
        {
        title:"Withdrawal History",
        icon:<WithdrawalIcon />,
        route:ROUTES.history,
        selected:false
        }
    ])
    const navigation = useRouter()
    return  <div className="my-10 mt-20">
            <div className="flex items-center gap-10 text-center">
                {btns.map((btn,i)=><div 
                key={i}
                >
                <button 
                onClick={()=>{
                   setBtns(btns.map((b,o)=>{
                    b.selected = o == i?!b.selected:false
                    return b
                   })) 
                   navigation.push(btn.route!)
                }}
                className={`flex cursor-pointer shadow items-center gap-1 justify-center  p-2 px-4 text-[20px] ${btn.selected?`bg-${COLOURS.green}`:`bg-${COLOURS.white}`}  ${!btn.selected?`text-${COLOURS.green}`:`text-${COLOURS.white}`} w-30 h-30 rounded-[100px]`}
                >
                    {btn.icon}
                </button>
                <div className="text-[16px] mt-3">{btn.title}</div>
                </div>
                )}
            </div>
         </div>
}