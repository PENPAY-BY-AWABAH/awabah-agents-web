"use client"
import { useRouter } from "next/navigation";
import { TabSection } from "./components/Tabs";
import { CommissionSection } from "../components/commission";
import { CommissionWalletBalance } from "./components/walletBalanceSection";

const Page = ()=>{
    const navigate = useRouter()
    return <div className="mb-6">
        <div className="flex items-center gap-3">
            <CommissionIcon />
            <div className="text-[32px] text-black">Commission</div>
        </div>
        <CommissionWalletBalance />
         <div className="text-[24px] mt-5">Commission History</div>
        <TabSection />
        <CommissionSection page={true} />
    </div>
}
export default Page;
export const CommissionIcon = ()=>{
    return <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.9955 23.22C17.3275 23.22 16.7575 22.9825 16.2855 22.5075C15.8135 22.0325 15.5775 21.461 15.5775 20.793C15.5775 20.125 15.815 19.555 16.29 19.083C16.765 18.611 17.337 18.375 18.006 18.375C18.675 18.375 19.245 18.613 19.716 19.089C20.187 19.565 20.423 20.1365 20.424 20.8035C20.425 21.4705 20.187 22.0405 19.71 22.5135C19.233 22.9865 18.6615 23.2225 17.9955 23.2215M12.5625 11.625H23.4375L26.2365 6H9.765L12.5625 11.625ZM12.9465 30H23.0535C24.9835 30 26.6235 29.3245 27.9735 27.9735C29.3245 26.6225 30 24.9795 30 23.0445C30 22.2365 29.8615 21.4495 29.5845 20.6835C29.3075 19.9175 28.9075 19.22 28.3845 18.591L23.8215 13.125H12.1785L7.6155 18.591C7.0925 19.22 6.6925 19.9175 6.4155 20.6835C6.1385 21.4485 6 22.2355 6 23.0445C6 24.9795 6.6755 26.6225 8.0265 27.9735C9.3775 29.3245 11.0175 30 12.9465 30Z" fill="#009668"/>
</svg>

}