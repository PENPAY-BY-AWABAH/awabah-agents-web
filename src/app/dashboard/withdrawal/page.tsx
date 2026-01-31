"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { useRouter } from "next/navigation";
import { BankIcon } from "@/app/assets/bank-icon";
import { SaveIcon } from "@/app/assets/save-icon";
import BaseButton from "@/app/components/baseButton";
import { ROUTES } from "@/app/includes/constants";
import { useState } from "react";

const Page = () => {
    const [selectedOption, setSelectedOption] = useState<string>("")


    const navigate = useRouter()
    return <div className="fixed top-0 left-0 w-full h-full bg-white p-[16px] lg:p-6 z-10">
        <div className="mb-6">
            <button
                onClick={() => {
                    navigate.back();
                }}
                className="flex items-center gap-2 cursor-pointer">
                <span className="hidden lg:block" >
                    <BackIcon />
                </span>
                <span className="lg:hidden">
                    <BackIcon size={30} />
                </span>
                <div className="">Back</div>
            </button>
        </div>

        <div className="m-auto items-center text-center   ">
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow lg:w-[500px] p-[30px] pb-[60px]">
                <div className="m-auto items-center text-center   ">
                    <div className="text-black text-[18px] lg:text-[24px] font-bold text-center mb-6">Withdrawal</div>
                    <div className="text-black text-[14px] font-normal text-left mb-4 mt-6">Select Withdrawal Destination</div>
                    <div className="flex item-center gap-4 mb-12 ">
                        <button
                            className={`flex-glow ${selectedOption === "bank" ? "bg-green-700 text-white" : "bg-[#C4C4C433]"} hover:bg-green-700 hover:text-white cursor-pointer  rounded-[15px] min-w-[125px] py-6 lg:p-6 text-black text-[16px] font-normal text-center`}
                            onClick={() => setSelectedOption("bank")}
                        >
                            <div className="text-center flex justify-center mb-2 items-center">
                                <BankIcon selected={selectedOption === "bank"} />
                            </div>
                            <div className="text-center text-[12px] lg:text-[14px]">Add bank Account</div>
                        </button>
                        <button className={` flex-glow ${selectedOption === "saved" ? "bg-green-700 text-white" : "bg-[#C4C4C433]"} hover:bg-green-700 hover:text-white cursor-pointer  rounded-[15px] min-w-[120px] py-6 lg:p-6 text-black text-[16px] font-normal text-center`}
                            onClick={() => setSelectedOption("saved")}
                        >
                            <div className="text-center flex justify-center mb-2 items-center">
                                <SaveIcon selected={selectedOption === "saved"} />
                            </div>
                            <div className="text-center text-[12px] lg:text-[14px]">Saved Account</div>
                        </button>
                    </div>
                    <BaseButton
                        disabled={selectedOption === ""}
                        onClick={() => {
                            //navigate to next page based on selection
                            if (selectedOption === "bank") {
                                navigate.push(ROUTES.addAccount)
                            }
                            else if (selectedOption === "saved") {
                                navigate.push(ROUTES.saveBankAccount)
                            }
                        }}
                        text="Next"
                        type="button"
                    />
                </div>
            </div>
        </div>
    </div>
}
export default Page;