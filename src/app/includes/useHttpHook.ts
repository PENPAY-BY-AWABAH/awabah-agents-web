/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { LoginProps } from "./types";
import { toast } from "react-toastify";
import { useApiRequest } from "./functions";
import {name}  from "../../../package.json"
export interface ApiResponse {
    status:boolean;
    message:string;
    data:any;
    statusCode?:number;
}
const useHttpHook = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const {call} = useApiRequest()
    const ShowMessage = (pros:{position:"center"|"right"} & ApiResponse)=>{
        if(pros.status) 
            {
                toast.success(pros.message, {
                    position:`top-${pros.position}` });
            }else{
                toast.error(pros.message, {
                    position:`top-${pros.position}` });
                }
            }
       
    const handleGetTransactions = (props:any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"transactions",
                body:props,
                method:"GET",
                requestType:"json",
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
  
    const handleGetSchedules = () => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            // PostRequest("subscriptions", {}).then((res) => {
            //     setLoading(false);
            //     resolve(res);
            // })
        })
    }
   
    const handleLogin = (prop: LoginProps) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"agent-sign-in",
                body:prop,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                ShowMessage({
                    position:"center",
                    ...res
                })
                if(res.status && res.data?.accessToken)
                {
                    window.localStorage.setItem(name,res.data.accessToken);
                } 
                resolve(res);
            })
        })
    }
    
    const handleOtp = (prop: LoginProps) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"agent-verify-forgot-password-otp",
                body:prop,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                ShowMessage({
                    position:"center",
                    ...res
                })
                resolve(res);
            })
        })
    }
    const handleGetProviders = () => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            // PostRequest("get:get-providers", {}, false).then((res) => {
            //     setLoading(false);
            //     resolve(res);
            // })
        })
    }
  
  const CheckReceipt = (refNo:string) => {
        return new Promise<ApiResponse>((resolve) => {
             call({
                path:`check-receipt?refNo=${refNo}`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
            resolve(res);
            })
        })
    }
    
    const handleForgotPassword = (email:string) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"admin-forgot-password",
                body:{email},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                ShowMessage({
                    position:"center",
                    ...res
                })
                resolve(res);
            })
        })
    }
    
     const GetBalance = () => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"agent-commission-balance",
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    const handleNewPassword = (data:any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"agent-save-new-password",
                body:data,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    
    const handleSendOtp = (email:string)=>{
    return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"agent-send-otp",
                body:{email},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                 ShowMessage({
                    position:"center",
                    ...res
                })
                resolve(res);
            })
        })
    }
    const getListOfBanks = () => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({ 
               path:"agent-get-nigerian-banks",
                body:{},
                method:"GET",
                requestType:"json"  
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }    
     
     const getMyBanks = () => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({ 
               path:"agent-get-banks",
                body:{},
                method:"GET",
                requestType:"json"  
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }   
    const saveBankAccount = (accountNumber: string,bankCode:string) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"agent-save-bank-details",
                body:{accountNumber,bankCode},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                 ShowMessage({
                    position:"center",
                    ...res
                })
                resolve(res);
            })
        })
    }
    const removeAcount = (accountNumber:string) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-delete-bank?accountNumber=${accountNumber}`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                 ShowMessage({
                    position:"center",
                    ...res
                })
                resolve(res);
            })
        })
    }
    
    const handleRegister = (data:any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-sign-up`,
                body:data,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                if(!res.status)
                {
                    ShowMessage({
                    position:"center",
                    ...res
                })
                }
                resolve(res);
            })
        })
    }
    const handleEmailOTPVerification = (data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-verify-registration-otp`,
                body:data,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                if(!res.status)
                {
                    ShowMessage({
                    position:"center",
                    ...res
                })
                }
                resolve(res);
            })
        })
    }
    const switchToAgentAccount = (data:any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-sign-in`,
                body:{
                    ...data,
                    account_switch:"yes"
                },
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                if(!res.status)
                {
                    ShowMessage({
                    position:"center",
                    ...res
                })
                }
                resolve(res);
            })
        })
    }

    return {
        loading,
        handleGetTransactions,
        handleLogin,
        handleGetSchedules,
        handleGetProviders,
        handleForgotPassword,
        handleOtp,
        CheckReceipt,
        GetBalance,
        handleNewPassword,
        handleSendOtp,
        getListOfBanks,
        getMyBanks,
        saveBankAccount,
        removeAcount,
        handleRegister,
        handleEmailOTPVerification,
        switchToAgentAccount
    }
}
export default useHttpHook;