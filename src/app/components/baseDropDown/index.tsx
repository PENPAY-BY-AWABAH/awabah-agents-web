/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useState } from "react";

export interface ListProps {
    key:string;
    value:string;
}
interface BaseDropDownProps {
    onChange:(data:ListProps)=>void;
    list:ListProps[];
    title:string;
    icon?:ReactNode;
    color?:string;
}
export const BaseDropDown = (props:BaseDropDownProps)=>{
const [show,setShow] = useState<boolean>(false);

return <div 

className="relative inline-block text-left">
<button 
onClick={()=>setShow(!show)}
className={`bg-white flex items-center justify-center gap-2 cursor-pointer  py-2 px-4 h-[40px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${props.color?props.color:"text-black border-1 border-black"}`}>
{props.title} {props.icon}
</button>
{show && <div
onMouseLeave={()=>{
  setShow(false)
}}
className="absolute z-40 right-0 min-w-48 mt-2 origin-top-right rounded-md shadow-sm bg-white ring-1 ring-black ring-opacity-5 group-hover:block overflow-hidden">
  <div className="py-1 bg-white max-h-[180px] overflow-scroll">
    {props.list.map((a,i)=><div key={i} onClick={()=>{
        props.onChange(a)
        setShow(false)
}} className="text-black cursor-pointer block px-4 py-2 text-sm hover:bg-teal-50">{a.key}</div>)}
  </div>
</div>}
</div>
}

export const FilterIcon = ()=>{
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  }
