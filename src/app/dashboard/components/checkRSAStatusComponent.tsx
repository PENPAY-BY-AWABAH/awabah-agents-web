import { BaseLoader } from "@/app/components/baseLoader";
import BaseModal from "@/app/components/baseModal"
import useHttpHook, { ApiResponse } from "@/app/includes/useHttpHook";
import { useEffect, useState } from "react";
import { UserItemProp } from "./users";

export const CheckRSAStatusComponent = ({onClose,user}:{onClose:()=>void;user:UserItemProp})=>{
     const {pushToPencom,pushToPFA,pushToPFC,loading} = useHttpHook()
    const [response,setResponse] = useState<ApiResponse | null>(null);
    useEffect(()=>{
        pushToPencom(user).then((res)=>{
         setResponse(res);
         if(res.status)
         {
         pushToPFC(user);
         pushToPFA(user);
         }
        })
    },[])
    return <BaseModal
    title="RSA Registration status"
    onClose={()=>{
        if(loading)
        {
            return ;
        }
        onClose();
    }}
    >
    <div >
     {loading && <div className="flex items-center justify-center gap-3">
        <BaseLoader size="md" modal={false} color="green" />
        <div className="text-[14px]">Please wait while we check you RSA PIN registration status...</div>
    </div>}
    {response?.status && !loading && <div className={`p-4  text-left`}>
      <div className="flex justify-center pb-2">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${response?.data?.rsaPin ? "bg-green-200" : "bg-red-200"} animate-pulse`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={response?.data?.rsaPin ? "text-green-700" : "text-red-700"} xmlns="http://www.w3.org/2000/svg">
            {response?.data?.rsaPin ? <>
              <path d="M20 7L9 18L4 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </> : <>
              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </>}
          </svg>
        </div>
      </div>
      <div className="text-[14px] text-black text-center pb-4">
        {response?.data?.rsaPin? "RSA PIN generated successfully" : "RSA PIN registration failed"}
      </div>
      {Object.keys(response.data).map((item,index)=>{
        return <div key={index} className={`text-[14px] text-black ${response?.data?.rsaPin? "text-center" : "text-left"}`}>
          <b>{String(item).toUpperCase().replace("RSAPIN","RSA PIN")}:</b> {response.data[item]}
        </div>
      })}  
    </div>}
    {!response?.status && !loading && <div >
    <div className="text-[14px] text-red-500 mb-2">RSA PIN registration failed</div>
    <div className="text-[14px] text-red-500">{response?.message}</div>
    </div>}
    </div>
    </BaseModal>
}
