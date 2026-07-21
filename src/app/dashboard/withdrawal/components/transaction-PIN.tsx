/* eslint-disable react-hooks/exhaustive-deps */
import BaseButton from "@/app/components/baseButton"
import BaseModal from "@/app/components/baseModal"
import { OTPBaseInput } from "@/app/components/baseOTPInput"
import useHttpHook from "@/app/includes/useHttpHook"
import { useEffect, useState } from "react"
import { CommissionStatsProps } from "../../commission/components/Tabs"
import { WithdrawalSuccessScreen } from "./success"
import { ForgotPINView } from "./forgotPin"

export const TransactionPINModal = ({onClose,account_number,bankName}:{onClose:()=>void;account_number:string;bankName:string})=>{
    const [pin,setPIN] = useState<string>("");
    const [showForgotPin,setShowForgotPin] = useState<boolean>(false);
    const {handleWithdrawalToAccount,loading,getAllCommisionStats} = useHttpHook();
    const [stats,setStats] = useState<CommissionStatsProps>({
        commissionEarn:0,
        withdrawals:0,
        balance:0,
        total_commission_earned:"0.00"
    });
    const [success,setSuccess] = useState<string | null>(null);
    useEffect(()=>{
      getAllCommisionStats().then((res)=>{
        if(res.status)
        {
            setStats(res.data)
        }
      })
    },[])
    const HandleTransfer = ()=>{
      handleWithdrawalToAccount({
            pin,
            account_number,
            monnify:true
        }).then((res)=>{
            if(res.status)
            {
              setSuccess(res.message!)
            }
        })
    }
    return <BaseModal 
    onClose={()=>{
        if(loading)
        {
          return ;
        }
        if(showForgotPin)
        {
          return setShowForgotPin(false)
        }
        onClose() 
        
    }}
    title={success?"":showForgotPin?"Forgot PIN":"Transaction PIN"}
    >
    <div >
    
     {showForgotPin?<ForgotPINView 
     onClose={()=>setShowForgotPin(false)}
     />:success?<WithdrawalSuccessScreen
     onClose={()=>onClose()}
     message={success}
     />:<div>
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
     loading={loading}
     disabled={pin.length !== 4}
     text="Continue"
     type="button"
     onClick={HandleTransfer}
     />
     <div className="flex items-center justify-center p-5">
      <button onClick={()=>{
        setShowForgotPin(true)
      }}
      className="text-green-800 cursor-pointer "
      >Forgot your PIN?</button>
     </div>
     </div>}
     </div>
    </BaseModal>
}