/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { OutflowIcon } from "@/app/assets/outflow-icon";
import { SliderIcon } from "@/app/assets/slider-filter";
import { UserIcon } from "@/app/assets/user-icon";
import BaseButton from "@/app/components/baseButton";
import BaseCard from "@/app/components/baseCard";
import BaseInputSearch from "@/app/components/baseInputSearch";
import { BaseLoader } from "@/app/components/baseLoader";
import { COLOURS, NairaSymbol, placeHolderAvatar, ROUTES } from "@/app/includes/constants"
import useHttpHook from "@/app/includes/useHttpHook";
import { DatabaseIcon, FilterIcon, SliceIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react"
export interface UserItemProp {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  accountType?: string;
  createdAt?: string;
  avatar?: null;
  phoneNumber?: string;
  secondaryPhoneNumber?: null;
  approved?: boolean;
  rsaNumber?: null;
  nextOfRegistered?: boolean;
  employerDetailsRegistered?: boolean;
  commission?:string;
}

export const UsersSection = ({page}:{page?:boolean})=>{
    const [list,setList] = useState<UserItemProp[]>([]);
    const [searchText,setSearchText] = useState<string>("");
    const [showFilter,setShowFilter] = useState<boolean>(false);
    const [filteredlist,setFilteredList] = useState<UserItemProp[]>([]);
    const {getAllUser,handleSearchUser,loading} = useHttpHook()
    const GetAllUsers = (page:number)=>{
    getAllUser(page).then((res)=>{
        if(res.status)
        {
            setList(res.data.users)
            setFilteredList(res.data.users)
        }
    })
    }
   
    useEffect(()=>{
        GetAllUsers(1);
    },[])
    const handleSearch = (search:string)=>{
        setSearchText(search);
        if(search == "")
        {
        return setFilteredList(list)
        }
        handleSearchUser(search).then((res)=>{
            if(res.status)
            {
            setFilteredList(res.data?.users)
            }else{
              setFilteredList([])  
            }
        })
       
    }
    const handleFilter = (value:string)=>{
        const filterValue = value == "Approved";
        setFilteredList(value === "All"?list:list.filter((a)=>a.approved == filterValue))
        setShowFilter(false)
    }
    return <div>
        <div className="flex" >
        <div className="text-[24px] flex-1" >All Users</div>
        {!page &&<Link href={ROUTES.history} className={`text-[22px] text-${COLOURS.green}`} >View All</Link>}
        </div>
        <div className="relative">
        <BaseInputSearch 
        name="search"
        onValueChange={({target})=>{
            handleSearch(target.value)
         }}
        value={searchText}
        placeholder="Search..."
        className="bg-[#C4C4C426] h-[100px]"
        trailingIcon={<button
        onClick={()=>{
           setShowFilter(!showFilter) 
        }}
        className="border-[1px] cursor-pointer gap-[10px] flex item-center border-[#00000059] py-[8px] px-[15px] rounded-[8px]"
        >
            <span className="text-[14px] text-black whitespace-nowrap" >Filter by</span>
            <SliderIcon />
        </button>}
        />
        {/* search drop down */}
        {showFilter && <BaseCard className="w-[180px] absolute right-[10px] z-[10] bg-white top-[48px]" >
            <ul 
                onMouseLeave={()=>setShowFilter(false)}
                className="grid gap-2 grid-col-1">
                <li 
                onClick={()=>handleFilter("All")}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] border-b-[0.5px] border-b-gray-300">All</li>
                <li 
                onClick={()=>handleFilter("Approved")}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] border-b-[0.5px] border-b-gray-300">Approved</li>
                <li 
                onClick={()=>handleFilter("Pending")}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px]">Pending</li>
            </ul>
        </BaseCard>}
        </div>
        {loading && <div className="m-auto  mt-5 text-center">
            <div className="m-auto flex justify-center item-center text-center">
            <BaseLoader color="green" size="lg" />
            </div>
            <div className="m-auto text-center">Fetching users...</div>
        </div>}
        {filteredlist.length === 0 &&<div className="m-auto my-5 mt-[50px] text-center">
        <div className="m-auto flex justify-center item-center text-center">
        <DatabaseIcon className="text-[#999]" size={50}/>
        </div>
        <div className="m-auto text-center text-[#44444]">No record found!</div>
        </div>}
        <div className="my-8 mt-6 grid grid-cols-4 gap-3 ">
        {filteredlist.map((item,i)=><div key={i} className="items-center  border-[#C4C4C459] border-[0.5px] rounded-[30px] p-5 shadow">
        <div className="flex items-center gap-3">
            <div className="" >
            <div className="h-[55px] w-[55px] bg-[#C4C4C459] border-[0.5px] rounded-[55px] overflow-hidden" >
            <img src={item?.avatar?item?.avatar:placeHolderAvatar.src}
            alt={item.id}
            className="h-full w-full"/>
            </div>
            </div>
            <div className="flex-1" >
            <div className="text-[#000000] text-[16px] font-bold">{item.firstName} {item.lastName}</div>
            <div className="flex mt-[5px]" >
            {item.approved?<div  className="flex text-[10px] gap-1 items-center bg-[#00A55826] text-[#00A558] rounded-[30px] px-2 py-1" >
            <ApprovedIcon />
            <div>Approved</div>
            </div>:<div className="flex text-[10px] gap-1 items-center bg-[#F4900C26] text-[#F4900C] rounded-[30px] px-2 py-1" >
            <PendingIcon />
            <div >Pending</div>
            </div>}
            </div>
        </div>
        </div>
        <div className="grid gap-[2px] mt-2 mb-4 ">
        <div className="flex items-center gap-[2px] h-[20px]">
            <div className="font-normal text-[12px] text-[#000000A6]">Date:</div>
            <div className="font-normal text-[12px]"> {moment(item.createdAt).format("DD MMM YYYY")}</div>
        </div>
        <div className="flex items-center gap-[2px] h-[20px]">
            <div className="font-normal text-[12px] text-[#000000A6]">Commission Earned:</div>
            <div className="font-normal text-[12px]"> {NairaSymbol}{item?.commission}</div>
        </div>
        <div className="flex items-center gap-[2px] h-[20px]">
            <div className="font-normal text-[12px] text-[#000000A6]">Contact:</div>
            <div className="font-normal text-[12px]"> {item.phoneNumber}</div>
        </div>
         <div className="flex items-center gap-[2px] h-[20px]">
            <div className="font-normal text-[12px] text-[#000000A6]">User status:</div>
            <div className={`font-normal text-[12px] ${item.approved?"text-[#00A558]":"text-[#F4900C]"}`}> Active</div>
        </div>
        </div>
        <BaseButton 
        text="View Profile"
        onClick={()=>{

        }}
        white
        type="button"
        />
        </div>)}
        </div>
        
        </div>
}
export const ApprovedIcon = ()=>{
    return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1251_9836)">
<path d="M2.24961 5.0288C2.16447 4.64527 2.17754 4.24646 2.28762 3.86933C2.39769 3.4922 2.60121 3.14897 2.8793 2.87147C3.15738 2.59396 3.50104 2.39116 3.8784 2.28188C4.25575 2.17259 4.65459 2.16035 5.03794 2.2463C5.24894 1.91631 5.53961 1.64474 5.88316 1.45663C6.22672 1.26852 6.61209 1.16992 7.00377 1.16992C7.39545 1.16992 7.78083 1.26852 8.12439 1.45663C8.46794 1.64474 8.75861 1.91631 8.96961 2.2463C9.35354 2.15998 9.75306 2.17216 10.131 2.28171C10.509 2.39127 10.8531 2.59463 11.1314 2.87289C11.4096 3.15114 11.613 3.49526 11.7225 3.87321C11.8321 4.25117 11.8443 4.6507 11.7579 5.03463C12.0879 5.24563 12.3595 5.5363 12.5476 5.87985C12.7357 6.2234 12.8343 6.60878 12.8343 7.00046C12.8343 7.39214 12.7357 7.77752 12.5476 8.12108C12.3595 8.46463 12.0879 8.7553 11.7579 8.9663C11.8439 9.34964 11.8316 9.74849 11.7224 10.1258C11.6131 10.5032 11.4103 10.8469 11.1328 11.1249C10.8553 11.403 10.512 11.6065 10.1349 11.7166C9.75778 11.8267 9.35897 11.8398 8.97544 11.7546C8.76472 12.0859 8.47382 12.3586 8.12968 12.5476C7.78554 12.7365 7.39929 12.8356 7.00669 12.8356C6.61409 12.8356 6.22784 12.7365 5.8837 12.5476C5.53956 12.3586 5.24866 12.0859 5.03794 11.7546C4.65459 11.8406 4.25575 11.8283 3.8784 11.7191C3.50104 11.6098 3.15738 11.407 2.8793 11.1295C2.60121 10.852 2.39769 10.5087 2.28762 10.1316C2.17754 9.75447 2.16447 9.35566 2.24961 8.97213C1.91708 8.76169 1.64318 8.47057 1.45339 8.12584C1.26359 7.78111 1.16406 7.39398 1.16406 7.00046C1.16406 6.60694 1.26359 6.21981 1.45339 5.87509C1.64318 5.53036 1.91708 5.23924 2.24961 5.0288Z" stroke="#00A558" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.25 7.00065L6.41667 8.16732L8.75 5.83398" stroke="#00A558" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1251_9836">
<rect width="14" height="14" fill="white"/>
</clipPath>
</defs>
</svg>
}

export const PendingIcon = ()=>{
    return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0ZM7 13C8.5913 13 10.1174 12.3679 11.2426 11.2426C12.3679 10.1174 13 8.5913 13 7C13 5.4087 12.3679 3.88258 11.2426 2.75736C10.1174 1.63214 8.5913 1 7 1C5.4087 1 3.88258 1.63214 2.75736 2.75736C1.63214 3.88258 1 5.4087 1 7C1 8.5913 1.63214 10.1174 2.75736 11.2426C3.88258 12.3679 5.4087 13 7 13ZM7.75 10.25C7.75 10.4489 7.67098 10.6397 7.53033 10.7803C7.38968 10.921 7.19891 11 7 11C6.80109 11 6.61032 10.921 6.46967 10.7803C6.32902 10.6397 6.25 10.4489 6.25 10.25C6.25 10.0511 6.32902 9.86032 6.46967 9.71967C6.61032 9.57902 6.80109 9.5 7 9.5C7.19891 9.5 7.38968 9.57902 7.53033 9.71967C7.67098 9.86032 7.75 10.0511 7.75 10.25ZM7 3C7.13261 3 7.25979 3.05268 7.35355 3.14645C7.44732 3.24021 7.5 3.36739 7.5 3.5V8C7.5 8.13261 7.44732 8.25979 7.35355 8.35355C7.25979 8.44732 7.13261 8.5 7 8.5C6.86739 8.5 6.74021 8.44732 6.64645 8.35355C6.55268 8.25979 6.5 8.13261 6.5 8V3.5C6.5 3.36739 6.55268 3.24021 6.64645 3.14645C6.74021 3.05268 6.86739 3 7 3Z" fill="#F4900C"/>
</svg>

}