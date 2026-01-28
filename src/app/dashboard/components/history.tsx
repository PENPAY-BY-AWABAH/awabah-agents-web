/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { OutflowIcon } from "@/app/assets/outflow-icon";
import BaseInputSearch from "@/app/components/baseInputSearch";
import { BaseLoader } from "@/app/components/baseLoader";
import { COLOURS, NairaSymbol, ROUTES } from "@/app/includes/constants"
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
export const HistorySection = ({ page }: { page?: boolean }) => {
    const [list, setList] = useState<HistoryItemProp[]>([]);
    const [filteredList, setFilteredList] = useState<HistoryItemProp[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const { getAllWithdrawals, handleSearchTransactions, loading } = useHttpHook()
    const GetWithdrawals = (page: number) => {
        getAllWithdrawals(page).then((res) => {
            if (res.status) {
                setList(res.data.list)
                setFilteredList(res.data.list)
            }
        })
    }

    useEffect(() => {
        GetWithdrawals(1);
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

    }, [])
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
        <div className="flex font-medium item-center mt-4 text-[14px] lg:text-[24px]" >
            <div className=" flex-1 " >Withdrawal History</div>
            {!page && <Link href={ROUTES.history} className={`text-${COLOURS.green} m-auto`} >View All</Link>}
        </div>
        {loading && <div className="m-auto  mt-5 text-center">
            <div className="m-auto flex justify-center item-center text-center">
                <BaseLoader color="green" size="lg" />
            </div>
            <div className="m-auto text-center">Fetching Withdrawals...</div>
        </div>}
        {filteredList.length === 0 &&<div className="m-auto my-5 mt-[50px] mb-[150px] text-center">
        <div className="m-auto flex justify-center item-center text-center">
        <DatabaseIcon className="text-[#999]" size={50}/>
        </div>
        <div className="m-auto text-center text-[#44444]">No record found!</div>
        </div>}
        <div className="my-8 mt-6 grid gap-3">
            {filteredList.map((item, i) => <div key={i} className="h-[80px] flex gap-3 items-center border-b-[0.5px] border-b-gray-200">
                <OutflowIcon />
                <div className="flex-1">
                    <div className="text-[#000000] text-[18px]">{item.memo}</div>
                    <div className="text-[#000000] text-[14px]">{NairaSymbol}{item.amount}</div>
                    <div className="text-[#000000A6] text-[12px]" >{moment(item.createdAt).format("Do MMM YYYY, hh:mm A")}</div>
                </div>
            </div>)}
        </div>
    </div>
}