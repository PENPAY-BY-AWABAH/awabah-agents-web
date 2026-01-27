"use client"
import { GreenBackground } from "@/app/assets/green-background"
import { COLOURS, ROUTES } from "@/app/includes/constants"
import { MaskBalance } from "@/app/includes/functions";
import useHttpHook from "@/app/includes/useHttpHook";
import { EyeClosed } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"
export interface WalletBalanceProps {
balance:string;
earnings?:string;
}
export const CommissionWalletBalance =()=>{
    const {GetBalance} = useHttpHook()
    const [balance,setBalance] = useState<WalletBalanceProps>({
        balance:"0.00",
        earnings:"0.00"
    })
    const [showBalance,setShowBalance] = useState<boolean>(false)
    const GetWalletInfo = ()=>{
        GetBalance().then((res)=>{
            if(res.status)
            {
              setBalance(res.data as WalletBalanceProps)
            }
        })
    }
    useEffect(()=>{
        GetWalletInfo();
    },[])
    return  <div className="mt-4 lg:mt-10 relative lg:h-30">
            <GreenBackground />
            <div className="absolute top-0 left-0 w-full p-[16px] lg:p-7 flex " >
            <div className="flex-grow" >
                <div className="text-[#FFFFFFD9] font-light flex item-center gap-1"><span className="w-[170px]">Total Commission Earned</span><button
                className="cursor-pointer ms-[-30px]"
                onClick={()=>setShowBalance(!showBalance)}
                >
                {showBalance?<EyeOpen />:<EyeClosed />}
                </button></div>
                <div className="text-white lg:font-normal font-bold text-[20px] lg:text-[38px] ">{MaskBalance(balance.earnings!,!showBalance)}</div>
                <div className="text-[#FFD983] text-[12px] lg:text-[14px]">Current balance: {MaskBalance((balance?.earnings || "0.00"),!showBalance)}<span></span></div>
            </div>
            <div className="lg:me-20 flex items-center">
                <Link 
                href={ROUTES.withdrawal}
                className={`flex cursor-pointer items-center gap-1 justify-center rounded-[12px] lg:rounded lg:p-2 px-2 lg:px-4 text-[16px] bg-${COLOURS.white} text-[${COLOURS.green}] `}
                >
                 <span className="lg:text-[14px] text-[12px]"> Withdraw</span>
                 <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_915_7961)">
<path d="M17.5798 9.93449C17.5652 10.0321 17.57 10.1315 17.5939 10.2273C17.6178 10.323 17.6603 10.413 17.7191 10.4923C17.7778 10.5715 17.8516 10.6384 17.9363 10.6891C18.0209 10.7398 18.1147 10.7733 18.2123 10.7876L22.7164 11.4556L14.5309 17.5238C14.3711 17.6423 14.2649 17.8194 14.2357 18.0161C14.2065 18.2129 14.2566 18.4132 14.3751 18.573C14.4935 18.7328 14.6706 18.839 14.8674 18.8682C15.0641 18.8974 15.2644 18.8473 15.4242 18.7288L23.6098 12.6606L22.9397 17.1645C22.9104 17.3615 22.9606 17.562 23.0792 17.722C23.1978 17.882 23.3751 17.9883 23.5721 18.0176C23.7691 18.0469 23.9697 17.9967 24.1297 17.8781C24.2897 17.7594 24.396 17.5821 24.4252 17.3851L25.3603 11.0903C25.3749 10.9927 25.3702 10.8932 25.3463 10.7975C25.3224 10.7018 25.2799 10.6117 25.2211 10.5325C25.1624 10.4532 25.0885 10.3863 25.0039 10.3357C24.9193 10.285 24.8255 10.2515 24.7279 10.2371L18.433 9.30204C18.3354 9.28742 18.2359 9.29219 18.1402 9.31608C18.0445 9.33997 17.9544 9.38251 17.8752 9.44126C17.7959 9.50001 17.7291 9.57381 17.6784 9.65845C17.6277 9.74309 17.5942 9.83689 17.5798 9.93449ZM8.3501 23.0395C8.82394 23.6787 9.53227 24.1034 10.3193 24.2203C11.1063 24.3372 11.9075 24.1367 12.5467 23.6629C13.1859 23.189 13.6106 22.4807 13.7275 21.6937C13.8444 20.9067 13.6439 20.1054 13.1701 19.4663C12.6962 18.8271 11.9879 18.4023 11.2009 18.2854C10.4139 18.1685 9.61265 18.3691 8.97348 18.8429C8.33432 19.3167 7.90956 20.0251 7.79265 20.8121C7.67574 21.5991 7.87626 22.4003 8.3501 23.0395ZM9.55509 22.1462C9.31817 21.8266 9.21792 21.426 9.27637 21.0325C9.33482 20.639 9.5472 20.2848 9.86679 20.0479C10.1864 19.811 10.587 19.7107 10.9805 19.7692C11.374 19.8276 11.7282 20.04 11.9651 20.3596C12.202 20.6792 12.3023 21.0798 12.2438 21.4733C12.1854 21.8668 11.973 22.221 11.6534 22.4579C11.3338 22.6948 10.9332 22.7951 10.5397 22.7366C10.1462 22.6781 9.79201 22.4658 9.55509 22.1462Z" fill="#009668"/>
</g>
<defs>
<clipPath id="clip0_915_7961">
<rect width="24" height="24" fill="white" transform="translate(19.2812) rotate(53.4493)"/>
</clipPath>
</defs>
</svg>

                </Link>
            </div>
            </div>
         </div>
}
const EyeOpen = ()=>{
    return <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 9.64 0.425 10.191 1.275 11.296C2.972 13.5 5.818 16 10 16C14.182 16 17.028 13.5 18.725 11.296C19.575 10.192 20 9.639 20 8C20 6.36 19.575 5.809 18.725 4.704C17.028 2.5 14.182 0 10 0C5.818 0 2.972 2.5 1.275 4.704C0.425 5.81 0 6.361 0 8ZM10 4.25C9.00544 4.25 8.05161 4.64509 7.34835 5.34835C6.64509 6.05161 6.25 7.00544 6.25 8C6.25 8.99456 6.64509 9.94839 7.34835 10.6517C8.05161 11.3549 9.00544 11.75 10 11.75C10.9946 11.75 11.9484 11.3549 12.6516 10.6517C13.3549 9.94839 13.75 8.99456 13.75 8C13.75 7.00544 13.3549 6.05161 12.6516 5.34835C11.9484 4.64509 10.9946 4.25 10 4.25Z" fill="white"/>
</svg>

}