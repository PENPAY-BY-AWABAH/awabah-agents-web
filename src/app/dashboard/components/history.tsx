/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { OutflowIcon } from "@/app/assets/outflow-icon";
import BaseInputSearch from "@/app/components/baseInputSearch";
import { BaseLoader } from "@/app/components/baseLoader";
import { COLOURS, ROUTES } from "@/app/includes/constants"
import useHttpHook from "@/app/includes/useHttpHook";
import { DatabaseIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react"
export interface HistoryItemProp {
    amount?: string;
    date?: string;
    description?: string;
    type?: string;
    currency?: string;
}
export const HistorySection = ({ page }: { page?: boolean }) => {
    const [list, setList] = useState<HistoryItemProp[]>([]);
    const [filteredList, setFilteredList] = useState<HistoryItemProp[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const { getAllTransactions, handleSearchTransactions, loading } = useHttpHook()
    const GetAllTransactions = (page: number) => {
        getAllTransactions(page).then((res) => {
            if (res.status) {
                setList(res.data.list)
                setFilteredList(res.data.list)
            }
        })
    }

    useEffect(() => {
        GetAllTransactions(1);
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
            setFilteredList(res.data?.users)
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
        <div className="flex" >
            <div className="text-[24px] flex-1 mt-4" >Withdrawal History</div>
            {!page && <Link href={ROUTES.history} className={`text-[22px] text-${COLOURS.green}`} >View All</Link>}
        </div>
        {loading && <div className="m-auto  mt-5 text-center">
            <div className="m-auto flex justify-center item-center text-center">
                <BaseLoader color="green" size="lg" />
            </div>
            <div className="m-auto text-center">Fetching Withdrawals...</div>
        </div>}
        {filteredList.length === 0 &&<div className="m-auto my-5 mt-[50px] mb-[120px] text-center">
        <div className="m-auto flex justify-center item-center text-center">
        <DatabaseIcon className="text-[#999]" size={50}/>
        </div>
        <div className="m-auto text-center text-[#44444]">No record found!</div>
        </div>}
        <div className="my-8 mt-6">
            {list.map((item, i) => <div key={i} className="h-[80px] flex gap-3 items-center border-b-[0.5px] border-b-gray-200">
                <OutflowIcon />
                <div className="flex-1">
                    <div className="text-[#000000] text-[18px]">{item.currency}{item.amount}</div>
                    <div className="text-[#000000A6] text-[14px]" >{item.date}</div>
                </div>
            </div>)}
        </div>
    </div>
}