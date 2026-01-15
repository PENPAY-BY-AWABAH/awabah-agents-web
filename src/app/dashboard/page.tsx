import { CopyIcon } from "../assets/copy-icon";
import { FeaturesBtnSection } from "./components/featuresButtonSection";
import { HistorySection } from "./components/history";
import { PerformanceSection } from "./components/performanceSection";
import { WalletBalance } from "./components/walletBalanceSection";

const Page = ()=>{
    return <div >
        <div className="text-[34px] font-bold">Welcome, Joseph!</div>
        <div className="text-[20px] text-[#000000A6] font-normal flex items-center gap-1">AWA-AG.000123 <span>
         <CopyIcon />
         </span></div>
        <WalletBalance />
        <FeaturesBtnSection />
        <PerformanceSection />
        <HistorySection />
    </div>
}
export default Page;