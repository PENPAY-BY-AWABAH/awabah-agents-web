import { CommissionEarnIcon } from "@/app/assets/commision-earn-icon"
import { CommissionWithdrawalIcon } from "@/app/assets/commision-withdrawal-icon"
import { OpenWalletIcon } from "@/app/assets/open-wallet-icon"
import { UserCheckIcon } from "@/app/assets/user-check-icon"
import { UserPendingIcon } from "@/app/assets/user-pending-icon"
import { UserRejectIcon } from "@/app/assets/user-reject-icon"
import { UsersIcon } from "@/app/assets/users-icon"
import useHttpHook from "@/app/includes/useHttpHook"
import { ReactElement, useEffect, useState } from "react"
interface TabSectionProp {
    title:string;
    icon?:string | ReactElement;
    description?:string;
    bgColour?:string;
    borderColour?:string;
    route?:string;
    value?:UsersStatsType;
    selected?:boolean;
}
type UsersStatsType = "usersOnboarded" | "approvedUsers" | "pendingVerification" | "rejected";
interface UsersStatsProps {
  usersOnboarded: number;
  approvedUsers: number;
  pendingVerification: number;
  rejected: number;
}

export const TabSection = ()=>{
    const {getAllUserStats} = useHttpHook()
    const [stats,setStats] = useState<UsersStatsProps>({
        rejected:0,
        approvedUsers:0,
        usersOnboarded:0,
        pendingVerification:0
    });
      const [btns,setBtns] = useState<TabSectionProp[]>([
            {
            title:"Commission Earned",
            icon:<CommissionEarnIcon size={40} />,
            route:"text-[#1879F8]",
            selected:true,
            bgColour:"bg-white",
            borderColour:"border-[#1879F8]",
            value:"usersOnboarded"
            },
            {
            title:"Available Balance",
            icon:<OpenWalletIcon />,
            route:"text-[#009668]",
            selected:false,
            bgColour:"bg-white",
            borderColour:"border-[#009668]",
            description:"3893",
            value:"approvedUsers"
            },
            {
            title:"Withdrawn",
            icon:<CommissionWithdrawalIcon />,
            route:"text-[#F4900C]",
            selected:false,
            bgColour:"bg-white",
            borderColour:"border-[#F4900C]",
            description:"390",
            value:"pendingVerification"
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
        <div className="grid grid-cols-4 items-center gap-9 my-8 mt-3">
            {btns.map((a,i)=><div key={i} className={`bg-[#C4C4C426] shadow grid grid-cols-1 text-center items-center flex-1 rounded-[40px] p-8 min-h-[163px]`} >
            <div className={`text-center m-auto ${a.route} ${String(a.borderColour).replace("border","text")} `}>{a.icon}</div>
            <div className="text-center text-black text-[28.3px] mt-3">{(stats[a.value!] || 0)}</div>
            <div className="text-center text-black text-[18.8px] mt-3">{a.title}</div>
            </div>)}
        </div>
    </div>
}