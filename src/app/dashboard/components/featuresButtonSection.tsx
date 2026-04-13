"use client"
import { RemitIcon } from "@/app/assets/remite-icon";
import { UserIcon } from "@/app/assets/user-icon";
import { WithdrawalIcon } from "@/app/assets/withdrawal-icon";
import { COLOURS, CONSTANT, RouteItem, ROUTES } from "@/app/includes/constants"
import useHttpHook from "@/app/includes/useHttpHook";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { ValidateRSAPinModal } from "./validateRSAPinModal";
export interface WalletBalanceProps {
balance:string;
earnings?:string;
}

const ValidateIcon = ()=>{
    return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" color="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12.5L10.8 14.3L15.5 9.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
}

export const FeaturesBtnSection =()=>{
    
    type FeatureBtn = RouteItem & { key: string; action?: () => void }
    const [showValidateModal, setShowValidateModal] = useState(false)
    const { getProviders, validateRSA } = useHttpHook()
    const [btns,setBtns] = useState<FeatureBtn[]>([
        {
        key:"onboard_user",
        title:"Onboard User",
        icon:<UserIcon />,
        route:ROUTES.userOnboarding,
        selected:true
        },
        {
        key:"remit",
        title:"Remit",
        icon:<RemitIcon />,
        route:ROUTES.remit,
        selected:false
        },
        {
        key:"withdrawal_history",
        title:"Withdrawal History",
        icon:<WithdrawalIcon />,
        route:ROUTES.history,
        selected:false
        },
        {
        key:"validate_rsa_pin",
        title:"Verify PIN Registration",
        icon:<ValidateIcon />,
        selected:false,
        action:()=>{
            setShowValidateModal(true)
        }
        },
    ])
    const navigation = useRouter()
    return  <div className="my-[10px] lg:my-10 lg:mt-20">
            <div className="flex items-center gap-10 text-center">
                {btns.map((btn,i)=><div 
                key={i}
                >
                <button 
                onClick={()=>{
                   setBtns(btns.map((b,o)=>({
                    ...b,
                    selected:o === i ? !Boolean(b.selected) : false
                   })))
                   localStorage.removeItem(CONSTANT.LocalStore.remit);
                   if(btn.route === ROUTES.history)
                   {
                   localStorage.setItem(CONSTANT.LocalStore.historySection,"withdrawal")
                   }
                   if(btn.action)
                   {
                    btn.action()
                    return
                   }
                   if(btn.route)
                   {
                    navigation.push(btn.route)
                   }
                }}
                className={`flex m-auto cursor-pointer shadow items-center gap-1 justify-center  p-2 lg:px-4 text-[20px] ${btn.selected?`bg-${COLOURS.green}`:`bg-${COLOURS.white}`}  ${!btn.selected?`text-${COLOURS.green}`:`text-${COLOURS.white}`} w-[65px] h-[65px] lg:w-30 lg:h-30 rounded-[65px] lg:rounded-[100px]`}
                >
                    {btn.icon}
                </button>
                <div className="text-[12px] text-center m-auto lg:text-[16px] mt-3">{btn.title}</div>
                </div>
                )}
            </div>
            {showValidateModal && <ValidateRSAPinModal onClose={() => setShowValidateModal(false)} />}
         </div>
}
