/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { OutflowIcon } from "@/app/assets/outflow-icon";
import { UserIcon } from "@/app/assets/user-icon";
import { COLOURS, ROUTES } from "@/app/includes/constants"
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react"
export interface UserItemProp {
firstName?:string;
lastName?:string;
date?:string;
description?:string;
}
export const UsersSection = ({page}:{page?:boolean})=>{
    const [list,setList] = useState<UserItemProp[]>([]);
    useEffect(()=>{
        setList(Array.from({length:15}).map((a,i)=>{
            return  {
            firstName:"John",
            lastName:"Paul",
            description:"dkdkdkd",
            date:moment().format("Do, MMM YYYY hh:mm A"),
        } as unknown as UserItemProp
        }))
    },[])
    return <div>
        <div className="flex" >
        <div className="text-[24px] flex-1" >Users</div>
        {!page &&<Link href={ROUTES.history} className={`text-[22px] text-${COLOURS.green}`} >View All</Link>}
        </div>
        <div className="my-8 mt-6">
        {list.map((item,i)=><div key={i} className="h-[80px] flex gap-3 items-center border-b-[0.5px] border-b-gray-200">
        <UserIcon />
        <div className="flex-1">
            <div className="text-[#000000] text-[18px]">{item.firstName} {item.lastName}</div>
            <div className="text-[#000000A6] text-[14px]" >{item.date}</div>
        </div>
        </div>)}
        </div>
        </div>
}