/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { useParams, useRouter } from "next/navigation";
import { BankIcon } from "@/app/assets/bank-icon";
import { useEffect, useState } from "react";
import BaseButton from "@/app/components/baseButton";
import BaseToggleBtn from "@/app/components/baseCheckBox";
import { BankItemProps, SavedAccountProps } from "@/app/includes/types";
import useHttpHook from "@/app/includes/useHttpHook";
import { ROUTES } from "@/app/includes/constants";
import { LinkBankModal } from "./components/link-modal";
import BaseModal from "@/app/components/baseModal";

const Page = () => {
    const [loadingRemoveAccount, setLoadingRemoveAccount] = useState<boolean>(false);
    const [listOfBanks, setListOfBanks] = useState<SavedAccountProps[]>([]);
    const [selectedOption, setSelectedOption] = useState<SavedAccountProps | null>(null)
    const [addNewAccount, setAddNewAccount] = useState<boolean>(false);
    const [addNewAccountDetails, setAddNewAccountDetails] = useState<BankItemProps | null>(null);

    const navigate = useRouter();
    const { getMyBanks, removeAcount, loading } = useHttpHook()
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
        const newAccount = localStorage.getItem("newlyAddedAccount");
        if (newAccount) {
            const acc: BankItemProps = JSON.parse(newAccount);
            setAddNewAccountDetails(acc);
            localStorage.removeItem("newlyAddedAccount");
        }
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
                                onClick={() => {
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
                                    text="Withdraw to this Account"
                                    type="button"
                                />
                            </div>
                            {selectedOption && <BaseButton
                                loading={loadingRemoveAccount}
                                white
                                onClick={() => {
                                    setLoadingRemoveAccount(true);
                                    removeAcount(String(selectedOption?.accountNumber)).then((res) => {
                                        setLoadingRemoveAccount(false);
                                        if (res.status) {
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
        {addNewAccountDetails && !loading && <div className="fixed flex inset-0 items-center justify-center z-50 m-auto bg-[rgba(0,0,0,0.5)] bg-opacity-50 h-full w-full ">
    <div className="m-auto items-center justify-center">
            <div className="m-auto items-center text-center  mb-[30px] rounded-[30px] shadow w-full max-w-[500px] p-[20px] pb-[30px] bg-white ">
                <div className="text-black flex font-medium text-center mb-2 m-auto items-center justify-center">
                    <svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.860008" y="0.860008" width="84.2808" height="84.2808" rx="42.1404" stroke="#07AE20" stroke-width="1.72002" />
                        <path d="M57.1303 33.5283C57.7438 35.1107 56.8852 36.1943 55.224 37.2636C53.8838 38.1236 52.1767 39.0582 50.3678 40.6535C48.5933 42.2173 46.8633 44.1021 45.3253 45.9569C44.0094 47.5492 42.7567 49.1926 41.5699 50.8833C40.9765 51.7304 40.1466 52.9946 40.1466 52.9946C39.8488 53.4547 39.4386 53.8313 38.9549 54.0888C38.4711 54.3464 37.9297 54.4764 37.3817 54.4666C36.834 54.4634 36.2963 54.3201 35.8196 54.0504C35.3429 53.7807 34.9432 53.3936 34.6583 52.9258C33.2264 50.5221 32.1227 49.5718 31.6153 49.2321C30.2579 48.3176 28.6641 48.1857 28.6641 46.0586C28.6641 44.3687 30.0902 42.9999 31.849 42.9999C33.0917 43.0457 34.2455 43.5345 35.2689 44.2225C35.9225 44.6611 36.6148 45.243 37.3344 46.007C38.2987 44.6911 39.3015 43.4039 40.3415 42.147C41.9999 40.1475 43.9579 38.0018 46.0577 36.1499C48.1218 34.3295 50.5083 32.6253 53.0381 31.7252C54.6865 31.1375 56.5183 31.9445 57.1303 33.5283Z" stroke="#07AE20" stroke-width="1.14668" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div className="text-black text-center w-[60%] text-[14px] font-normal m-auto mb-4">Your <b>{addNewAccountDetails?.name}</b> Account has been saved successfully!</div>
                <BaseButton
                    onClick={() => {
                        setAddNewAccountDetails(null);
                    }}
                    text="Done"
                    type="button"
                />
            </div>
            </div>
        </div>}
        {loading && <LinkBankModal
            onClose={() => { }}
            text={listOfBanks.length > 0 ? "Linking your bank account..." : "Loading your bank accounts..."}
        />}
    </div>
}
export default Page;