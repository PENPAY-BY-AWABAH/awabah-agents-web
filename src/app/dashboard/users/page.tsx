"use client"
import { UsersSection } from "../components/users";
import { TabSection } from "./components/Tabs";
import { UsersIcon } from "@/app/assets/users-u-icon";

const Page = ()=>{
    return <div className="mb-6">
        <div className="flex items-center gap-3">
            <UsersIcon />
            <div className="text-[20px] lg:text-[32px] text-[#009668]">Users</div>
        </div>
        <TabSection />
        <UsersSection page={true} />
    </div>
}
export default Page;
