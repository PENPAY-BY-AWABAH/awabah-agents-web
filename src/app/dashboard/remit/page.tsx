/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { BackIcon } from "@/app/assets/back-icon";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import BaseInput from "@/app/components/baseInput";
import BaseSelect from "@/app/components/baseSelect";
import useHttpHook from "@/app/includes/useHttpHook";
import { ItemProps } from "@/app/includes/types";
import { ReturnAllNumbers, ReturnComma } from "@/app/includes/functions";
import BaseButton from "@/app/components/baseButton";
import { PaymentVericationModal } from "./components/payment_verification_modal";
import { Split } from "lucide-react";
import { CONSTANT } from "@/app/includes/constants";
interface PaymentProp {
    rsaPin?: string;
    pfaName?: string;
    amount?: string;
    providerId?: string;
    isValid?: boolean;
    fullName?: string;
    phoneNumber?: string;
}
interface ListOfPfa {
    id: string;
    name: string;
    provderId: string;
    createdAt: string;
}
export interface PaymentResponseProp {
    status?: boolean;
    loading?: boolean;
    id?: string;
    memo?: string;
    amount?: string;
    email?: string;
    reference?: string;
    createdAt?: string;
    paymentUrl?: string;
    paymentRef?: string;
    phoneNumber?: string;
    fullName?:string;
}
const Page = () => {
    const [listOfPfa, setListOfPfa] = useState<ListOfPfa[]>([])
    const navigate = useRouter();
    const { getProviders, validateRSA, remitMicroPension, verifyTransaction } = useHttpHook();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<PaymentProp>(
        {
            rsaPin: "",
            pfaName: "",
            providerId: "",
            amount: "",
            fullName: "",
            isValid: false
        }
    )
    const getListOfProvider = () => {
        getProviders().then((res) => {
            if (res.status) {
                setListOfPfa(res.data)
            }
        })
    }
    const [paymentDetails, setPaymentDetails] = useState<PaymentResponseProp | null>(null);
    const getUrlParams = (queryParams: URLSearchParams) => {
        // Get individual values
        const verifyPayment = queryParams.get('veriy_payment');
        const trxref = queryParams.get('trxref');
        const reference = queryParams.get('reference');
        return { verifyPayment, trxref, reference };
    };
    useEffect(() => {
        getListOfProvider();
    }, [])
    useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
        const urlParams = getUrlParams(queryParams);
        if (urlParams.verifyPayment !== null) {
            setPaymentDetails({
                ...paymentDetails,
                status: false,
                loading: true
            })

            verifyTransaction({ reference: urlParams.reference }).then((res) => {
                setPaymentDetails({
                    ...res.data,
                    status: res.status,
                    loading: false
                })
                if(res.status)
                {
                    localStorage.removeIteme(CONSTANT.LocalStore.remit);
                }
            })

        }
    }, [])
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)
        if (!formData.isValid) {
            localStorage.setItem(CONSTANT.LocalStore.remit,JSON.stringify(formData))
            validateRSA({
                rsaPin: formData.rsaPin,
                providerId: formData.providerId
            }).then((res) => {
                setLoading(false)
                if (res.status) {
                    setFormData({
                        ...formData,
                        isValid: true,
                        fullName: res.data.rsaDetail.name,
                        pfaName: res.data.rsaDetail.pfaName
                    })
                }
            })
        } else {
            const webhook = String(window.location.href).split("?").filter((a,i)=>i == 0).join("");
            
            remitMicroPension({
                ...formData,
                callback_url:webhook
            }).then((res) => {
                setLoading(false)
                if (res.status && res.data?.paymentUrl) {
                    window.open(res.data.paymentUrl,"_self")
                }
            })
        }
    }
    useEffect(()=>{
     const data = localStorage.getItem(CONSTANT.LocalStore.remit);
     if(data)
     {
        setFormData(JSON.parse(data))
     }
    },[])
    return <div className="bg-white h-screen p-4">
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
        <form
            onSubmit={handleSubmit}
        >
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow w-[500px] p-[30px] pb-[60px]">
                <div className="text-black text-[24px] text-center mb-5">Fill in the details to pay</div>
                <BaseInput
                    required
                    label="RSA PIN"
                    placeholder="Enter RSA PIN"
                    type="text"
                    name={"rsaPIN"}
                    value={formData.rsaPin}
                    onValueChange={({ value }) => {
                        setFormData({
                            ...formData,
                            isValid: false,
                            rsaPin: value
                        });
                    }}
                />
                <BaseInput
                    required
                    label="Phone number"
                    placeholder="Enter Phone number"
                    type="text"
                    max={11}
                    name={"phoneNumber"}
                    value={formData.phoneNumber}
                    onValueChange={({ value }) => {
                        setFormData({
                            ...formData,
                            isValid: false,
                            phoneNumber: ReturnAllNumbers(value)
                        });
                    }}
                />
                <BaseInput
                    required
                    label="Amount"
                    placeholder="Enter Amount"
                    type="text"
                    name="amount"
                    max={9}
                    value={formData.amount}
                    onValueChange={({ value }) => {
                        setFormData({
                            ...formData,
                            amount: ReturnAllNumbers(String(parseInt(value)))
                        });
                    }}
                />
                <div className="text-left">
                    <BaseSelect
                        custom
                        list={listOfPfa.map((a: any) => {
                            return {
                                title: a.name,
                                description: a.name,
                                value: a.provderId
                            }
                        }) as unknown as ItemProps[]}
                        name="pfaName"
                        required
                        disabled={formData.isValid}
                        onValueChange={(value) => {
                            setFormData({
                                ...formData,
                                isValid: false,
                                providerId: value.value,
                                pfaName: value.title
                            });
                        }}
                        value={formData.pfaName!}
                        placeholder="Select a provider"
                        label="Provider"
                    />
                </div>
                {formData.isValid && <div className="mt-5">
                    <BaseInput
                        label="Full name"
                        placeholder="Full name"
                        type="text"
                        name="name"
                        disabled
                        value={formData.fullName}
                        onValueChange={({ value }) => {

                        }}
                    /></div>}
                <div className="mt-5">
                    <BaseButton
                        text={formData?.isValid ? "Continue" : "Validate RSA PIN"}
                        type="submit"
                        loading={loading}
                    />
                </div>
            </div>
        </form>
        {paymentDetails && <PaymentVericationModal
        onClose={()=>setPaymentDetails(null)}
        details={paymentDetails}
        />}
    </div>
}
export default Page;