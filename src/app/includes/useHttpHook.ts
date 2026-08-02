/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { LoginProps } from "./types";
import { toast } from "react-toastify";
import { useApiRequest } from "./functions";
import {name}  from "../../../package.json";
import { UserItemProp } from "../dashboard/components/users";
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
                if(!res.data?.switch_account)
                {
                ShowMessage({
                    position:"center",
                    ...res
                })
            }
                if(res.status && res.data?.accessToken)
                {
                    window.localStorage.setItem(name,res.data.accessToken);
                } 
                resolve(res);
            })
        })
    }
    const handleLoginWithNIN = (prop: any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"agent-sign-in-with-nin",
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
                ShowMessage({
                    ...res,
                    position:"center"
                })
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
               path:"agent-get-nigerian-banks?monnify=true",
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

    const saveBankAccount = (accountNumber: string,bankCode:string,trackingId?:string) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
            call({
                path:"agent-save-bank-details",
                body:{
                    accountNumber,
                    bankCode,
                    monnify:true,
                    trackingId
                },
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
                    ShowMessage({
                    position:"center",
                    ...res
                })
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
                if(res.status && res.data?.accessToken)
                {
                    window.localStorage.setItem(name,res.data.accessToken);
                } 
                resolve(res);
            })
        })
    }
const getAgentProfile  = () => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-profile`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    const handleRegisterUser =(data:any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-user-${String(data.userType).toLowerCase()}-registration`,
                body:data,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                    res.message = String(res.message).replace("NIN found","Oops, this NIN already has an RSA, please contact your PFA.")
                        ShowMessage({
                        position:"center",
                        ...res
                    })
                resolve(res);
            })
        })
    }
    const handleNextOfKin =(data:any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-save-next-of-kin`,
                body:data,
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
    const handleRemiteMicroPensions = (data:any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`remite-micro-pension`,
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
    const getRSAPIN = (data:any) => {
        return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`get-rsa-pin`,
                body:data,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    const getAllUser = (page:number = 1)=>{
          return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-get-users?page=${page}`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    const getAllComission = (page:number = 1)=>{
          return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-get-list-of-commission?page=${page}`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
const getAllUserStats = ()=>{
 return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-get-users-stats`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
const handleSearchUser = (searchText:string)=>{
 return new Promise<ApiResponse>((resolve) => {
            setLoading(true);
           call({
                path:`agent-search-users`,
                body:{
                    searchText
                },
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }

 const saveProfileDetails = (data:any)=>{
 return new Promise<ApiResponse>((resolve) => {
           setLoading(true);
           call({
                path:`agent-save-profile`,
                body:data,
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

const updatePassword = (data:any)=>{
 return new Promise<ApiResponse>((resolve) => {
           setLoading(true);
           call({
                path:`agent-save-password`,
                body:data,
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
    
const updatePIN = (data:any)=>{
 return new Promise<ApiResponse>((resolve) => {
           setLoading(true);
           call({
                path:`agent-update-transaction-pin`,
                body:data,
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
    const updateAvatar = (data:any)=>{
         return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-update-profile-image`,
                body:{
                    avatar:data
                },
                method:"POST",
                requestType:"form-data"
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
    const getAllTransactions = (page:any)=>{
         return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-get-transaction-history?page=${page}`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    const handleSearchTransactions = (page:any,search:string)=>{
         return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-search-transaction?page=${page}&searchText=${search}`,
                body:{},
                method:"GET",
                requestType:"form-data"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    const getProviders = ()=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`get-pension-providers`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    const validateRSA = (data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-verify-user-rsa-pin`,
                body:data,
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
    const remitMicroPension = (data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-naira-micro-pension`,
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
    const verifyTransaction = (data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-verify-micro-pension-transaction`,
                body:data,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    
    const getAllCommisionStats = ()=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-commision-stats`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
const handleEmploymentDetails =(data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-save-employment-details`,
                body:data,
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
    const handleParentDetails =(data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-save-parent-information`,
                body:data,
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
    const handleCreatePassword  = (data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-save-parent-information`,
                body:data,
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
const handleRSAPINRequest =(data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-request-rsa-pin`,
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
    const handleOtherDetails =(data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-save-other-info`,
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
    const handleUpdateWalletPIN  =(data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-update-wallet-pin`,
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
    const handleWithdrawalToAccount  =(data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-withdraw-commission`,
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
    const getAllWithdrawals  =(page:number)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-get-withdrawal-history?page=${page}`,
                body:{},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }

    const getUserByEmail  =(email:string)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-get-user-by-email`,
                body:{email},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    const ResetTestData =(email:string)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-reset`,
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
    const RequestForRSAPIN = (data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-request-rsa-pin`,
                body:data,
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                  if(res.message.includes("Unknown Employer"))
                    {
                    res.message = "We are unable to process your job type at the moment. Please select a different option. Thank you."
                    }
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
   const handleCheckUserEmailIsAgent = (email:string)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-check-if-user-is-agent`,
                body:{email},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
const ResendOTP = (email:string)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-resend-otp`,
                body:{email},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
    
const GetListOfSectors = ()=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-get-consent`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }

const handleForgotTransactionPin = ()=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-forgot-txt-pin`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }
const SaveConsent = (data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-save-consent`,
                body:data,
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

const handleSaveTxtPIN = (data:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-verify-and-save-transation-pin`,
                body:data,
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
const GetListOfPFA = ()=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-get-list-onboarded-pfa`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                resolve(res);
            })
        })
    }
const validateNIN = (nin:string)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-validate-nin`,
                body:{nin},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                if(!res.status){
                    ShowMessage({
                        position:"center",
                        ...res
                    })
                }
                resolve(res);
            })
        })
    }
const handleDeleteAccount = (nin:string)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`agent-delete-account`,
                body:{nin},
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
const GetListOfStates = ()=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`get-list-of-states-lgas`,
                body:{},
                method:"GET",
                requestType:"json"
            }).then((res) => {
                resolve(res);
            })
        })
    }

const pushToPencom = (user:UserItemProp)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`admin-awabah-pushtopencom`,
                body:{trackingId:user.trackingId},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }  

const pushToPFC= (user:UserItemProp)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`admin-awabah-pushtopfc`,
                body:{trackingId:user.trackingId},
                method:"POST",
                requestType:"json"
            },false,true).then((res) => {
                setLoading(false);
                resolve(res);
            },)
        })
    }  
    
const pushToPFA= (user:UserItemProp)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`admin-awabah-pushtopfa`,
                body:{trackingId:user.trackingId},
                method:"POST",
                requestType:"json"
            },false,true).then((res) => {
                setLoading(false);
                resolve(res);
            })
        })
    }     
const ConfirmRegistration = (nin:any)=>{
        return new Promise<ApiResponse>((resolve) => {
         setLoading(true);
           call({
                path:`continue-rsa-pin-registration`,
                body:{nin},
                method:"POST",
                requestType:"json"
            }).then((res) => {
                setLoading(false);
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
        switchToAgentAccount,
        getAgentProfile,
        handleRegisterUser,
        handleNextOfKin,
        handleRemiteMicroPensions,
        getRSAPIN,
        getAllUser,
        getAllUserStats,
        handleSearchUser,
        saveProfileDetails,
        updatePassword,
        updatePIN,
        updateAvatar,
        getAllComission,
        getAllTransactions,
        handleSearchTransactions,
        getProviders,
        validateRSA,
        remitMicroPension,
        verifyTransaction,
        getAllCommisionStats,
        handleEmploymentDetails,
        handleParentDetails,
        handleCreatePassword,
        handleRSAPINRequest,
        handleOtherDetails,
        handleUpdateWalletPIN,
        handleWithdrawalToAccount,
        getAllWithdrawals,
        getUserByEmail,
        ShowMessage,
        ResetTestData,
        RequestForRSAPIN,
        handleCheckUserEmailIsAgent,
        ResendOTP,
        GetListOfSectors,
        SaveConsent,
        handleForgotTransactionPin,
        handleSaveTxtPIN,
        GetListOfPFA,
        handleLoginWithNIN,
        validateNIN,
        handleDeleteAccount,
        GetListOfStates,
        pushToPencom,
        pushToPFC,
        pushToPFA,
        ConfirmRegistration
    }
}
export default useHttpHook;