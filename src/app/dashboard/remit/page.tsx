"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { useRouter } from "next/navigation";

const Page = ()=>{
    const navigate = useRouter();
    return <div className="bg-white h-screen p-4">
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
    </div>
}
export default Page;