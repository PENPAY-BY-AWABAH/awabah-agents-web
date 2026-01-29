/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseModal from "@/app/components/baseModal"
import { PaymentResponseProp } from "../page"
import BaseButton from "@/app/components/baseButton"
import { JSX, useEffect, useState } from "react";
import { MonnifyLogo, PaystackIcon } from "@/app/includes/payment-gateways";
import { TickIcon } from "@/app/assets/tick-icon";
interface ListItemPros {
    icon:string | JSX.Element;
    title?:string;
    description?:string;
    selected?:boolean;
    action:string;
}
export const PaymentOptionsModal = ({onClose,details,onPayment}:{onClose:()=>void;details:PaymentResponseProp;onPayment:(gateway:string)=>void})=>{
    const [List,setList] = useState<ListItemPros[]>([
    {
        icon:<MonnifyLogo />,
        selected:true,
        title:"Monnify",
        action:"monnify"
    },
    {
        icon:<PaystackIcon />,
        selected:false,
        title:"Paystack",
        action:"paystack"
    }
 ]);
const [selectedOption,setSelectedOption] = useState<string>(List[0].action);

 return <BaseModal 
        title={"Payment Options"}
        onClose={()=>{
            onClose()
        }}
        >
        <div>
        <div className="mt-5 ">
        <div className="text-left w-full">Select one of the payment options below.</div>
        {List.map((a,i,self)=><div onClick={()=>{
        setList(List.map((item,index)=>{
            item.selected = index === i;
            return item;
        }))
        setSelectedOption(a.action)
    }} 
    key={i}
     className={`${a.selected?" bg-green-50 shadow rounded-md":"bg-white shadow rounded-md"} my-3 p-2`}>
    <div className="flex items-center p-3 gap-2 cursor-pointer">
    <div className="pe-2" style={{width:40}}>
    {typeof(a.icon) === "string"?<img alt="x" style={{width:20,height:20,backgroundColor:"#ddd"}} src={a.icon}/>:a.icon}
    </div>
    <div className="flex-grow items-center text-left" >
    {a.selected?<div >{a.title}</div>:<div  >{a.title}</div>}
    {a.description ?<div  >{a.description}</div>:null}
    </div>
    {a.selected ?<div className="right-[8px]" >
    <TickIcon />
    </div>:i === self.length - 1?<div className="right-[8px]" >
    </div>:null}
    </div>
    </div>)}
        <BaseButton
        text="Pay Now"
        type="button"
        onClick={()=>onPayment(selectedOption)}
        white
        />
        </div>
        </div>
        </BaseModal>
}