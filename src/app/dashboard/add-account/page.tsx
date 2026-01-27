"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { BankIcon } from "@/app/assets/bank-icon";
import BaseButton from "@/app/components/baseButton"
import BaseInput from "@/app/components/baseInput";
import { ROUTES } from "@/app/includes/constants";
import { BankItemProps } from "@/app/includes/types";
import useHttpHook from "@/app/includes/useHttpHook";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const Page = () => {
    const { loading, saveBankAccount } = useHttpHook();
    const [showAddAccountNumber, setShowAddAccountNumber] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");
    const [listOfBanks, setListOfBanks] = useState<BankItemProps[]>([]);
    const [selectedOption, setSelectedOption] = useState<BankItemProps | null>(null)
    const [accountNumber, setAccountNumber] = useState<string>("");
    const { getListOfBanks } = useHttpHook()
    const ListOfBanks = () => {
        getListOfBanks().then((res) => {
            if (res.status) {
                const banks = res.data as BankItemProps[]
                //set list of banks
                setListOfBanks(banks);
            }
        })
    }
    const navigate = useRouter();
    useEffect(() => {
        ListOfBanks();
    }, []);

    const handleSaveAccountNumber = (e: FormEvent) => {
        e.preventDefault();
        saveBankAccount(accountNumber,String(selectedOption?.code)).then((res) => {  
            if (res.status) {
                navigate.push(ROUTES.saveBankAccount);
                localStorage.setItem("newlyAddedAccount", JSON.stringify(selectedOption));
            }
        })
    }
    const list = searchText === "" ? listOfBanks : listOfBanks.filter((bnk) => bnk.name?.toLowerCase().includes(searchText.toLowerCase()));
    return <div className="fixed top-0 left-0 w-full h-full bg-white p-[16px] lg:p-6 z-10">
        <div className="mb-6">
            <button
                onClick={() => {
                    if (showAddAccountNumber) {
                        return setShowAddAccountNumber(false);
                    }
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
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow w-[500px] p-[30px] pb-[60px]">
                <div className="m-auto items-center text-center   ">
                    <div className="w-full justify-center items-center gap-6">
                        <div className="text-black text-[24px] font-bold text-center mb-6">Add Account</div>
                        {!showAddAccountNumber ? <div className="w-full">
                            <BaseInput
                                label="Search Bank"
                                placeholder="Enter bank name"
                                type="text"
                                name={""}
                                value={searchText}
                                onValueChange={({ value }) => {
                                    setSearchText(value);
                                }}
                            />
                            <div className="gap-4 mb-12 h-[300px] overflow-scroll ">
                                {list.length === 0 && <div className="justify-center pt-[100px] items-center text-center">
                                    <svg className="m-auto" width="80" height="56" viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5391 38.2727L10.5391 21.8827C10.5391 20.6266 11.5308 19.6084 12.7541 19.6084L40.4731 19.6084C41.6965 19.6084 42.6882 20.6266 42.6882 21.8827V38.2727C42.6882 39.5288 41.6965 40.5471 40.4731 40.5471H12.7541C11.5308 40.5471 10.5391 39.5288 10.5391 38.2727Z" fill="#C4C4C4" />
                                        <path opacity="0.5" d="M5.47656 33.0784L5.47656 16.6884C5.47656 15.4323 6.46829 14.4141 7.69164 14.4141L35.4106 14.4141C36.634 14.4141 37.6257 15.4323 37.6257 16.6884V33.0784C37.6257 34.3345 36.634 35.3527 35.4106 35.3527H7.69164C6.46829 35.3527 5.47656 34.3345 5.47656 33.0784Z" fill="white" />
                                        <path opacity="0.7" d="M8.28906 27.463V17.3727C8.28906 16.8139 8.73029 16.3608 9.27456 16.3608H18.3332C18.8775 16.3608 19.3187 16.8139 19.3187 17.3727V27.463C19.3187 28.0218 18.8775 28.4748 18.3332 28.4748H9.27456C8.73029 28.4748 8.28906 28.0218 8.28906 27.463Z" fill="white" />
                                        <path opacity="0.3" d="M21.0469 32.3413V24.6099C21.0469 24.1808 21.3856 23.833 21.8035 23.833H28.7447C29.1626 23.833 29.5014 24.1808 29.5014 24.6099V32.3413C29.5014 32.7704 29.1626 33.1182 28.7447 33.1182H21.8035C21.3856 33.1182 21.0469 32.7704 21.0469 32.3413Z" fill="white" />
                                        <path d="M74.4737 46.9585L73.2837 48.152L75.8802 49.4051C75.8802 49.4051 76.5087 48.2742 76.0724 47.253L74.4737 46.9585Z" fill="#E4897B" />
                                        <path d="M72.3205 49.929L74.5142 50.85L75.875 49.3934L73.2816 48.1528L72.3205 49.929Z" fill="#E4897B" />
                                        <path opacity="0.4" d="M27.8818 48.6452C32.1988 48.1475 36.2752 46.3468 39.5956 43.4708C42.916 40.5948 45.3314 36.7726 46.5364 32.4874C47.7414 28.2022 47.6819 23.6463 46.3655 19.3958C45.049 15.1453 42.5347 11.3909 39.1404 8.60731C35.7461 5.82373 31.6242 4.13591 27.2958 3.75723C22.9674 3.37855 18.6268 4.32601 14.8227 6.47982C11.0187 8.63364 7.92197 11.8971 5.9241 15.8577C3.92622 19.8183 3.11687 24.2981 3.59836 28.7309C3.91827 31.676 4.80028 34.5276 6.19401 37.1225C7.58773 39.7175 9.46585 42.0051 11.721 43.8545C13.9762 45.7039 16.5642 47.0789 19.3371 47.9009C22.1101 48.7229 25.0136 48.9758 27.8818 48.6452Z" fill="#FAFAFA" />
                                        <path d="M50.1633 17.6082L50.4531 17.508C49.9511 15.9871 49.3202 14.5143 48.5676 13.1066L48.3021 13.257C49.0448 14.649 49.6676 16.1049 50.1633 17.6082ZM46.4593 10.2966L46.7064 10.1118C44.199 6.63076 40.9174 3.81563 37.1352 1.90113L36.9979 2.18307C40.7371 4.0778 43.9811 6.86285 46.4593 10.306V10.2966ZM13.0226 2.61224C14.0196 2.06316 15.0511 1.58281 16.1103 1.17435L16.0004 0.879883C14.9309 1.29792 13.8892 1.78767 12.8822 2.34596L13.0226 2.61224Z" fill="#C4C4C4" />
                                        <path opacity="0.3" d="M50.1633 17.6082L50.4531 17.508C49.9511 15.9871 49.3202 14.5143 48.5676 13.1066L48.3021 13.257C49.0448 14.649 49.6676 16.1049 50.1633 17.6082ZM46.4593 10.2966L46.7064 10.1118C44.199 6.63076 40.9174 3.81563 37.1352 1.90113L36.9979 2.18307C40.7371 4.0778 43.9811 6.86285 46.4593 10.306V10.2966ZM13.0226 2.61224C14.0196 2.06316 15.0511 1.58281 16.1103 1.17435L16.0004 0.879883C14.9309 1.29792 13.8892 1.78767 12.8822 2.34596L13.0226 2.61224Z" fill="black" />
                                        <path d="M2.72351 14.7085C5.54871 8.69236 10.5204 4.02316 16.6079 1.66888C22.6954 -0.685397 29.4318 -0.54419 35.4206 2.06323C41.4095 4.67065 46.1914 9.5443 48.7751 15.6738C51.3588 21.8034 51.5461 28.7187 49.2981 34.9862C51.3362 35.7192 53.3499 36.5055 55.3514 37.3169C58.2378 38.4927 61.0976 39.7207 63.9311 41.0009C66.7625 42.2884 69.5817 43.601 72.3734 44.9731C73.7738 45.6466 75.156 46.3577 76.5503 47.0469C77.2757 47.3669 77.9329 47.8299 78.4847 48.4096C78.7833 48.7306 79.0463 49.0847 79.2688 49.4653C79.5403 49.9155 79.7459 50.4042 79.879 50.9157C80.1086 51.8376 80.0093 52.8134 79.5991 53.6666C79.1889 54.5198 78.4949 55.1942 77.6426 55.5677C77.1693 55.7715 76.6699 55.9044 76.1598 55.9624C75.7289 56.0125 75.2939 56.0125 74.8631 55.9624C74.0801 55.8648 73.3234 55.6105 72.6358 55.2137C71.2536 54.4963 69.8623 53.804 68.4894 53.0679C65.7434 51.63 62.9974 50.1294 60.285 48.607C57.5726 47.0845 54.8572 45.49 52.2088 43.8547C50.3782 42.7176 48.5293 41.5554 46.7169 40.3399C43.2368 45.9807 37.7764 50.0307 31.4672 51.6505C25.158 53.2704 18.4837 52.3359 12.8273 49.0408C7.17081 45.7457 2.96586 40.3426 1.08372 33.951C-0.798409 27.5594 -0.213448 20.6693 2.71741 14.7085H2.72351ZM16.5937 44.6348C20.1394 46.4317 24.1245 47.1089 28.0451 46.5805C31.9656 46.0522 35.6456 44.3421 38.6196 41.6665C41.5936 38.9909 43.7281 35.47 44.7533 31.5489C45.7784 27.6278 45.6481 23.4827 44.3789 19.6376C43.1097 15.7925 40.7585 12.4202 37.6227 9.94705C34.4869 7.47389 30.7072 6.01095 26.7617 5.74323C22.8161 5.4755 18.8818 6.415 15.4563 8.44294C12.0307 10.4709 9.26776 13.4962 7.51675 17.1363C6.35387 19.5538 5.66622 22.1827 5.49306 24.8731C5.31989 27.5634 5.6646 30.2625 6.50749 32.816C7.3504 35.3696 8.67497 37.7276 10.4056 39.7555C12.1362 41.7834 14.2389 43.4414 16.5937 44.6348Z" fill="#C4C4C4" />
                                        <path opacity="0.3" d="M2.72351 14.7085C5.54871 8.69236 10.5204 4.02316 16.6079 1.66888C22.6954 -0.685397 29.4318 -0.54419 35.4206 2.06323C41.4095 4.67065 46.1914 9.5443 48.7751 15.6738C51.3588 21.8034 51.5461 28.7187 49.2981 34.9862C51.3362 35.7192 53.3499 36.5055 55.3514 37.3169C58.2378 38.4927 61.0976 39.7207 63.9311 41.0009C66.7625 42.2884 69.5817 43.601 72.3734 44.9731C73.7738 45.6466 75.156 46.3577 76.5503 47.0469C77.2757 47.3669 77.9329 47.8299 78.4847 48.4096C78.7833 48.7306 79.0463 49.0847 79.2688 49.4653C79.5403 49.9155 79.7459 50.4042 79.879 50.9157C80.1086 51.8376 80.0093 52.8134 79.5991 53.6666C79.1889 54.5198 78.4949 55.1942 77.6426 55.5677C77.1693 55.7715 76.6699 55.9044 76.1598 55.9624C75.7289 56.0125 75.2939 56.0125 74.8631 55.9624C74.0801 55.8648 73.3234 55.6105 72.6358 55.2137C71.2536 54.4963 69.8623 53.804 68.4894 53.0679C65.7434 51.63 62.9974 50.1294 60.285 48.607C57.5726 47.0845 54.8572 45.49 52.2088 43.8547C50.3782 42.7176 48.5293 41.5554 46.7169 40.3399C43.2368 45.9807 37.7764 50.0307 31.4672 51.6505C25.158 53.2704 18.4837 52.3359 12.8273 49.0408C7.17081 45.7457 2.96586 40.3426 1.08372 33.951C-0.798409 27.5594 -0.213448 20.6693 2.71741 14.7085H2.72351ZM16.5937 44.6348C20.1394 46.4317 24.1245 47.1089 28.0451 46.5805C31.9656 46.0522 35.6456 44.3421 38.6196 41.6665C41.5936 38.9909 43.7281 35.47 44.7533 31.5489C45.7784 27.6278 45.6481 23.4827 44.3789 19.6376C43.1097 15.7925 40.7585 12.4202 37.6227 9.94705C34.4869 7.47389 30.7072 6.01095 26.7617 5.74323C22.8161 5.4755 18.8818 6.415 15.4563 8.44294C12.0307 10.4709 9.26776 13.4962 7.51675 17.1363C6.35387 19.5538 5.66622 22.1827 5.49306 24.8731C5.31989 27.5634 5.6646 30.2625 6.50749 32.816C7.3504 35.3696 8.67497 37.7276 10.4056 39.7555C12.1362 41.7834 14.2389 43.4414 16.5937 44.6348Z" fill="black" />
                                    </svg>

                                    <div className="text-center mt-6">No bank found</div>
                                </div>
                                }
                                {list.map((bnk, i) => <button
                                    key={i}
                                    onClick={() => setSelectedOption(bnk)}
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
                                    <div className="text-left flex-1">{bnk?.name}</div>
                                </button>)}
                            </div>
                            {selectedOption && <div className="flex justify-center items-center mb-2">Selected Bank : <b className="ms-1">{selectedOption?.name}</b></div>}
                        <div>
                            <BaseButton
                                disabled={selectedOption === null}
                                onClick={() => {
                                    setShowAddAccountNumber(true);
                                }}
                                text={"Next"}
                                type={"button"}
                            />
                        </div>
                        </div> : <form 
                        onSubmit={handleSaveAccountNumber}
                        className="w-full">
                            <BaseInput
                            required
                                label="Bank Name"
                                placeholder="Enter Bank Name"
                                type="text"
                                disabled
                                name={"bankName"}
                                value={selectedOption?.name}
                                onValueChange={({ value }) => {

                                }}
                            />
                            <BaseInput
                            required
                            max={10}
                                label="Account Number"
                                placeholder="Enter Account Number"
                                type="mobile"
                                name={"accountNumber"}
                                value={accountNumber}
                                onValueChange={({ value }) => {
                                    setAccountNumber(value)
                                }}
                            />
                            <div>
                            <BaseButton
                            loading={loading}
                            disabled={accountNumber === "" || accountNumber.length < 10 || selectedOption === null}
                            text={"Add Account"}
                            type={"submit"}
                            />
                        </div>
                        </form>}
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default Page; 