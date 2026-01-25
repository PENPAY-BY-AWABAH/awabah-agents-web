import BaseModal from "@/app/components/baseModal"
import { RefObject, useRef, useState } from "react"
import { BaseLoader } from "@/app/components/baseLoader"
import { useRouter } from "next/navigation"
import { PaymentResponseProp } from "../page"
import moment from "moment"
import BaseButton from "@/app/components/baseButton"
import html2canvas from 'html2canvas';
export const PaymentVericationModal = ({onClose,details}:{onClose:()=>void;details:PaymentResponseProp})=>{
    const navigate = useRouter();
    const [downloading,setDownloading] = useState<boolean>(false)
    const divRef = useRef<HTMLDivElement>(null);
    const HandleDownloadReceipt = async()=>{
    setDownloading(true)
    const canvas = await html2canvas(divRef.current!);
    const dataURL = canvas.toDataURL('image/png');
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `payment-receipt-${details.reference}`;
    link.click();
    setTimeout(()=>{
    setDownloading(false)
    onClose()
    },500)

}
    return <BaseModal 
        title={details?.loading || !details?.createdAt?"":"Payment Receipt"}
        onClose={()=>{
            if(!details?.loading)
            {
            onClose()
            }
        }}
        >
        <div>
            {details?.loading?<div className="m-auto  mt-5 text-center">
            <div className="m-auto flex justify-center item-center text-center">
                <BaseLoader color="green" size="lg" />
            </div>
            <div className="m-auto text-center">Please wait while we verify your transaction...</div>
        </div>:details?.createdAt?<div className="relative">
        <div ref={divRef} className="relative">
        <div className="p-5 grid gap-2" style={{backgroundColor:"#f1f1f1"}}>
            <div className="font-normal">{String(details.memo).replace("initialized","")}</div>
              <div className="w-full flex gap-3 item-center ">
                <div className="font-bold">Full Name:</div>
                <div >{details.email}</div>
                </div> 
                <div className="w-full flex gap-3 item-center ">
                <div className="font-bold">Email:</div>
                <div >{details.email}</div>
                </div>
                <div className="w-full flex gap-3 item-center ">
                <div className="font-bold">Phone number:</div>
                <div >{details.phoneNumber}</div>
                </div>
                <div className="w-full flex gap-3 item-center ">
                <div className="font-bold">Amount:</div>
                <div >{details.amount}</div>
                </div>
                <div className="w-full flex gap-3 item-center ">
                <div className="font-bold">Ref. No.:</div>
                <div >{details.reference}</div>
                </div>
                <div className="w-full flex gap-3 item-center ">
                <div className="font-bold">Date:</div>
                <div >{moment(details.createdAt).format("Do MMMM, YYYY")}</div>
                </div>
                <div className="w-full flex gap-3 item-center ">
                <div className="font-bold">Time:</div>
                <div >{moment(details.createdAt).format("hh:mm A")}</div>
                </div>
        </div>
        <div 
        className="absolute top-[13px] grid gap-[10px] left-[-10px]"
        >
        {Array.from({length:10}).map((a,i)=><div key={i} className="w-[20px] h-[20px] rounded-[20px] bg-white"></div>)} 
        </div>
        <div 
        className="absolute top-[13px] grid gap-[10px] right-[-10px]"
        >
        {Array.from({length:10}).map((a,i)=><div key={i} className="w-[20px] h-[20px] rounded-[20px] bg-white"></div>)} 
        </div>
        </div>
        <div className="mt-5" >
        <BaseButton
        loading={downloading}
        text="Download Receipt"
        type="button"
        onClick={HandleDownloadReceipt}
        white
        />
        </div>
        </div>:<div >
 <div className="bg-slate-50 py-12 flex justify-center relative">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
                <div className="bg-white p-6 rounded-3xl shadow-lg relative z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="text-amber-500" />
                    </svg>
                </div>
            </div>
        </div>

        <div className="p-10 text-center">
            <h3 className="text-md font-extrabold text-slate-900 mb-3 tracking-tight">
                Transaction Not Found
            </h3>
            <p className="text-slate-500 text-md leading-relaxed mb-8">
                {"We couldn't find the transaction details you're looking for. It might have been canceled, or the reference link has expired."}
            </p>
            </div>
        </div>}
        </div>
        </BaseModal>
}