"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { useRouter } from "next/navigation";
import { BankIcon } from "@/app/assets/bank-icon";
import { useEffect, useState } from "react";
import BaseButton from "@/app/components/baseButton";
import BaseToggleBtn from "@/app/components/baseCheckBox";
import { SavedAccountProps } from "@/app/includes/types";
import useHttpHook from "@/app/includes/useHttpHook";
import { ROUTES } from "@/app/includes/constants";

const Page = () => {
    const [loadingRemoveAccount, setLoadingRemoveAccount] = useState<boolean>(false);
    const [listOfBanks, setListOfBanks] = useState<SavedAccountProps[]>([]);
    const [selectedOption, setSelectedOption] = useState<SavedAccountProps | null>(null)
    const [addNewAccount, setAddNewAccount] = useState<boolean>(false);
    const navigate = useRouter();
    const { getMyBanks,removeAcount } = useHttpHook()
    const ListOfBanks = () => {
        getMyBanks().then((res) => {
            if (res.status) {
                const banks = res.data as SavedAccountProps[]
                //set list of banks
                setListOfBanks(banks);
            } else {
                navigate.push(ROUTES.addAccount)
            }
        })
    }
    useEffect(() => {
        ListOfBanks();
    }, []);

    return <div className="fixed top-0 left-0 w-full h-full bg-white p-6 z-10">
        <div className="mb-6">
            <button
                onClick={() => {
                    navigate.back();
                }}
                className="flex items-center gap-2 cursor-pointer">
                <BackIcon />
                <div className="">Back</div>
            </button>
        </div>
        <div className="m-auto items-center text-center   ">
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow w-[500px] p-[30px] pb-[60px]">
                <div className="m-auto items-center text-center   ">
                    <div className="w-full">
                        <div className="text-black text-[24px] font-bold text-center mb-6">Saved Accounts</div>
                        <div className="text-black text-[14px] font-normal text-left mb-4 mt-6">Select the account you want to send funds to</div>
                        <div className="grid grid-cols-1 gap-4 mb-12 ">
                            {listOfBanks.map((bnk, i) => <button
                                key={i}
                                onClick={() => {
                                    setSelectedOption(bnk)
                                    setAddNewAccount(false)
                                }}
                                className={`flex h-[60px] w-full mb-3 items-center cursor-pointer border-[0.5px] border-[#000000A6]  rounded-[15px] p-2 text-black text-[16px] font-normal text-center`}
                            >
                                <div
                                    className={`w-[20px] h-[20px] rounded-[20px] flex justify-center items-center p-[2px] border-[0.5px] border-black cursor-pointer`}
                                >
                                    <div className={`w-full h-full rounded-full ${selectedOption === bnk ? "bg-green-700" : "bg-white"} `}></div>
                                </div>
                                <div className="text-center flex justify-center items-center mx-3">
                                    <BankIcon selected={selectedOption !== bnk} />
                                </div>
                                <div className="text-left flex-1">{bnk?.bankName} : {bnk?.accountNumber}</div>
                            </button>)}
                            {listOfBanks.length < 2 && <button
                            onClick={()=>{
                                setAddNewAccount(true)
                                setSelectedOption(null)
                            }}
                                className={`flex gap-2 items-center cursor-pointer border-[0.5px] border-[#000000A6]  rounded-[15px] p-2 text-black text-[16px] font-normal text-center`}
                            >
                                <div
                                    className={`w-[20px] h-[20px] rounded-[20px] flex justify-center items-center p-[2px] border-[0.5px] border-black cursor-pointer`}
                                >
                                    <div className={`w-full h-full rounded-full ${addNewAccount ? "bg-green-700" : "bg-white"} `}></div>
                                </div>
                                <div className="text-center flex justify-center items-center">
                                    <BankIcon selected={addNewAccount} />
                                </div>
                                <div className="text-left flex-1">Add a new account</div>
                            </button>}
                        </div>

                        {addNewAccount ? <BaseButton
                            disabled={!addNewAccount}
                            onClick={() => {
                                if (addNewAccount) {
                                    return navigate.push(ROUTES.addAccount)
                                }

                            }}
                            text="Add New Account"
                            type="button"
                        /> : <div>
                        <div className="mb-3"  >
                        <BaseButton
                            disabled={selectedOption === null}
                            onClick={() => {

                            }}
                            text="Continue"
                            type="button"
                        />
                        </div>
                        {selectedOption && <BaseButton
                        loading={loadingRemoveAccount}
                        white
                            onClick={() => {
                             setLoadingRemoveAccount(true);
                            removeAcount(String(selectedOption?.accountNumber)).then((res)=>{
                               setLoadingRemoveAccount(false);
                                if(res.status)
                                {
                                    //refresh list
                                    ListOfBanks();
                                    setSelectedOption(null);
                                }
                            })
                            }}
                            text="Remove Account"
                            type="button"
                        />}   
                      </div>  
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default Page;