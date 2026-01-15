"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { HistorySection } from "../components/history";
import { useRouter } from "next/navigation";
import { UsersSection } from "../components/users";

const Page = ()=>{
    const navigate = useRouter()
    return <div >
        <div className="mb-6">
        <button 
        onClick={()=>{
        navigate.back();
        }}
        className="flex items-center gap-2 cursor-pointer">
            <BackIcon />
            <div className="">Back</div>
        </button>
        </div>
        <UsersSection page={true} />
    </div>
}
export default Page;