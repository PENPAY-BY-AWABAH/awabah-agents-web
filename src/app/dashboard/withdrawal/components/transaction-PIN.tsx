import BaseButton from "@/app/components/baseButton"
import { BaseLoader } from "@/app/components/baseLoader"
import BaseModal from "@/app/components/baseModal"
import { OTPBaseInput } from "@/app/components/baseOTPInput"
import useHttpHook from "@/app/includes/useHttpHook"
import { useEffect, useState } from "react"
import { CommissionStatsProps } from "../../commission/components/Tabs"

export const TransactionPINModal = ({onClose,account_number,bankName}:{onClose:()=>void;account_number:string;bankName:string})=>{
    const [pin,setPIN] = useState<string>("");
    const {handleWithdrawalToAccount,loading,getAllCommisionStats} = useHttpHook();
    const [stats,setStats] = useState<CommissionStatsProps>({
        commissionEarn:0,
        withdrawals:0,
        balance:0,
    });
    useEffect(()=>{
      getAllCommisionStats().then((res)=>{
        if(res.status)
        {
            setStats(res.data)
        }
      })
    },[])
    return <BaseModal 
    onClose={()=>{
        if(!loading)
        {
           onClose() 
        }
    }}
    title={loading?"":"Transaction PIN"}
    >
     {!loading?<div>
     <div className="text-center p-2 bg-green-100 mb-3 rounded text-[14px] px-4" >
      <div ></div>
      <div className="text-center " >
        <b>Your Wallet Balance is:</b> N{stats.balance}
     </div>
     <hr className="text-gray-300 my-4"/>
     <div className="text-black text-[18px] mb-3">Recepient Account</div>
      <div className="text-center " >
        <b>Bank Name:</b> {bankName}
     </div>
      <div className="text-center " >
        <b>Account Number:</b> {account_number}
     </div> 
     </div>
     <div className="text-center mb-3" >Enter your tranasction PIN</div>
     <div className="max-w-[55%] flex item-center justify-center m-auto mb-5">
       <OTPBaseInput 
       onChange={(otp: string)=>{
         setPIN(otp)
        } } 
        isInputNum
        count={4} 
        value={pin}      
        />
     </div>
     <BaseButton
     disabled={pin.length !== 4}
     text="Continue"
     type="button"
     onClick={()=>{
        handleWithdrawalToAccount({
            pin,
            account_number
        }).then((res)=>{
            if(res.status)
            {
                onClose();
            }
        })
     }}
     />
     </div>:<div className="flex item-center justify-center">
    <BaseLoader color="green" size="lg" text="" />
<div className="text-center ms-2 text-black text-[14px] ">Proccessing...</div>
    </div>}
    </BaseModal>
}