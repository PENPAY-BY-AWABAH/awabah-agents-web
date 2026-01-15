"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { useRouter } from "next/navigation";
import { CommissionSection } from "../components/commission";

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
        <CommissionSection page={true} />
    </div>
}
export default Page;