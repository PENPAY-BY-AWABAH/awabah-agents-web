/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { OutflowIcon } from "@/app/assets/outflow-icon";
import BaseInputSearch from "@/app/components/baseInputSearch";
import { BaseLoader } from "@/app/components/baseLoader";
import { COLOURS, CONSTANT, NairaSymbol, ROUTES } from "@/app/includes/constants"
import { ReturnComma } from "@/app/includes/functions";
import useHttpHook from "@/app/includes/useHttpHook";
import { DatabaseIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react"
export interface HistoryItemProp {
    amount?: string;
    id?:string;
    email?:string;
    ref?:string;
    status?:string;
    memo?: string;
    accountNumber?:string;
    bankName?:string;
    createdAt?:string;
    type?: string;
    currency?: string;
    fullName?:string;
}
type BtnType = "withdrawal"|"remittance"|null
export const HistorySection = ({ page }: { page?: boolean }) => {
    const [selectedItem, setSelectedItem] = useState<BtnType>("withdrawal");
    const [list, setList] = useState<HistoryItemProp[]>([]);
    const [filteredList, setFilteredList] = useState<HistoryItemProp[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const { getAllWithdrawals, handleSearchTransactions,getAllTransactions, loading } = useHttpHook()
    const GetWithdrawals = (page: number) => {
        getAllWithdrawals(page).then((res) => {
            if (res.status) {
                setList(res.data.list)
                setFilteredList(res.data.list)
           }else{
                setFilteredList([])
            }
        })
    }
const GetRemittance  = (page: number) => {
        getAllTransactions(page).then((res) => {
            if (res.status) {
                setList(res.data.list)
                setFilteredList(res.data.list.filter((a:any,i:number)=>a.status === "success"))
            }else{
                setFilteredList([])
            }
        })
    }
    useEffect(() => {
       const section = localStorage.getItem(CONSTANT.LocalStore.historySection);
       if(section)
       {
        setSelectedItem(section as BtnType)
        if(section === "withdrawal")
        {
            GetWithdrawals(1);
        }else{
            GetRemittance(1);
        }
       }
    }, [])

    const handleSearch = (search: string) => {
        setSearchText(search);
        if(search == "")
        {
        return setFilteredList(list)
        }

        handleSearchTransactions(1,search).then((res)=>{
            if(res.status)
            {
            setFilteredList(res.data?.list)
            }else{
              setFilteredList([])  
            }
        })

    }
    useEffect(() => {
        if(selectedItem === "withdrawal")
        {
            GetWithdrawals(1);
        }else{
            GetRemittance(1);
        }
    }, [selectedItem])
    return <div>
        {page && <div className="relative">
            <BaseInputSearch
                name="search"
                onValueChange={({ target }) => {
                    handleSearch(target.value)
                }}
                value={searchText}
                placeholder="Search..."
                className="bg-[#C4C4C426] h-[100px]"
            />
        </div>}
        <div className="flex lg:grid lg:grid-cols-5 font-medium item-center mt-4 text-[14px] lg:text-[24px] gap-5" >
            <div className="flex-grow lg:col-span-1 " ><button 
            onClick={()=>{
                setSelectedItem("withdrawal")
                setSearchText("")
                localStorage.setItem(CONSTANT.LocalStore.historySection,"withdrawal")
            }}
            className={`cursor-pointer ${selectedItem === "withdrawal"?"text-black":"text-gray-400"}`}
            >Withdrawal History</button></div>
            <div className="flex-grow lg:col-span-3" ><button 
            onClick={()=>{
                setSelectedItem("remittance");
                setSearchText("")
                localStorage.setItem(CONSTANT.LocalStore.historySection,"remittance")
            }}
            className={`cursor-pointer ${selectedItem === "remittance"?"text-black":"text-gray-400"}`}>Remittance History</button></div>
            <div className="justify-end items-end text-right">
            {!page && <Link href={ROUTES.history} className={`text-${COLOURS.green} text-right`} >View All</Link>}
        </div>
        </div>
        {loading && <div className="m-auto  mt-5 text-center">
            <div className="m-auto flex justify-center item-center text-center">
                <BaseLoader color="green" size="lg" />
            </div>
            <div className="m-auto text-center">Fetching Withdrawals...</div>
        </div>}
        <div className="mb-[120px]" >
        {filteredList.length === 0 &&<div className="m-auto my-5 mt-[50px] mb-[150px] text-center">
        <div className="m-auto flex justify-center item-center text-center">
        <DatabaseIcon className="text-[#999]" size={50}/>
        </div>
        <div className="m-auto text-center text-[#44444]">No record found!</div>
        </div>}
        <div className="my-8 mt-6 grid gap-3">
            {filteredList.map((item, i) => <div key={i} className="lg:h-[80px] pb-2 flex gap-3 items-center border-b-[0.5px] border-b-gray-200">
                <OutflowIcon />
                <div className="flex-1">
                    <div className="text-[#000000] text-[18px]">{String(item.memo).replace("initialized .",".").replace("Naira ","")} <span className="text-gray-400">{selectedItem === "remittance"?" ~ "+item.fullName:""}</span></div>
                    <div className="text-[#000000] text-[14px]">{NairaSymbol}{item.amount}</div>
                    <div className="text-[#000000A6] text-[12px]" >{moment(item.createdAt).format("Do MMM YYYY, hh:mm A")}</div>
                </div>
            </div>)}
        </div>
        </div>
    </div>
}