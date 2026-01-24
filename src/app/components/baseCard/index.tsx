import { ReactNode } from "react";

interface BaseCardProps {
children:ReactNode;
className?:string;
}
const BaseCard = (props:BaseCardProps)=>{
return <div 
className={`border-[1px] border-[#EBEBEB] rounded-[16px] ${props.className}`}
>
    {props.children}
</div>
}
export default BaseCard;