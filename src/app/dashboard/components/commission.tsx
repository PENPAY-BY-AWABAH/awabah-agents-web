/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { COLOURS, placeHolderAvatar, ROUTES } from "@/app/includes/constants"
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react"
import { ApprovedIcon, PendingIcon, UserItemProp } from "./users";
import useHttpHook from "@/app/includes/useHttpHook";
import { DatabaseIcon } from "lucide-react";
import { BaseLoader } from "@/app/components/baseLoader";
export interface CommissionItemProp {
id?:string;
fullName?:string;
email?:string;
amount?:string;
createdAt?:string;
avatar?:string;
phoneNumber?:string;
rsaNumber?:string;
ref?:string;
approved?:boolean;
}
export const CommissionSection = ({page}:{page?:boolean})=>{

    const [list,setList] = useState<CommissionItemProp[]>([]);
    const {getAllComission,handleSearchUser,loading} = useHttpHook()
    const GetAllUsers = (page:number)=>{
    getAllComission(page).then((res)=>{
        if(res.status)
        {
            setList(res.data.list)
        }
    })
    }
   
    useEffect(()=>{
        GetAllUsers(1);
    },[])

   
    return <div>
        <div className="flex mt-[16px] " >
        <div className="text-[18px] font-medium lg:text-[24px] ">Commission History</div>
        {!page &&<Link href={ROUTES.history} className={`text-[22px] text-${COLOURS.green}`} >View All</Link>}
        </div>
        {loading && <div className="m-auto  mt-5 text-center">
            <div className="m-auto flex justify-center item-center text-center">
            <BaseLoader color="green" size="lg" />
            </div>
            <div className="m-auto text-center text-[12px] lg:text-[14px]">Fetching users...</div>
        </div>}
        {list.length === 0 &&<div className="m-auto my-5 mt-[50px] text-center">
        <div className="m-auto flex justify-center item-center text-center">
        <DatabaseIcon className="text-[#999]" size={50}/>
        </div>
        <div className="m-auto text-center text-[#44444] text-[12px] lg:text-[14px]">No record found!</div>
        </div>}
        <div className="mb-[150px] lg:mb-8 mt-6">
        {list.map((item,i)=><div key={i} className="h-[80px] flex gap-3 items-center border-b-[0.5px] border-b-gray-200">
        <div
            className="h-[59px] w-[59px] relative cursor-pointer bg-[#C4C4C459] border-[0.5px] rounded-[59px] overflow-hidden" >
            <img src={placeHolderAvatar.src}
             alt={String(i)}
             className="h-full w-full" />
            </div>
        <div className="flex-1">
            <div className="text-[#000000] text-[14px] lg:text-[18px] ">{item.fullName}<span className="ms-3 text-[14px] lg:text-[18px] text-[#00000073]">~ Onboarding</span></div>
            <div className="text-[#000000A6] text-[12px] lg:text-[14px] flex gap-2 item-center text-[#000000A6] " >
                {item.approved?<div  className="flex item-center text-[10px] gap-1 items-center bg-[#00A55826] text-[#00A558] rounded-[30px] px-2 py-1" >
                            <ApprovedIcon />
                            <div>Approved</div>
                            </div>
                            :<div className="flex text-[10px] gap-1 items-center bg-[#F4900C26] text-[#F4900C] rounded-[30px] px-2 py-1" >
                            <PendingIcon />
                            <div >Pending</div>
                            </div>}
                {moment(item.createdAt).format("Do MMM YYYY, hh:mm A")}</div>
        </div>
        </div>)}
        </div>
        </div>
}