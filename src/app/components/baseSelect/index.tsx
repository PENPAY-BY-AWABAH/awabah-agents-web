/* eslint-disable react-hooks/exhaustive-deps */
import { ItemProps } from "@/app/includes/types";
import {Ban, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
interface BaseSelectProps {
    list:ItemProps[];
    onValueChange:(data:ItemProps)=>void;
    placeholder?:string;
    required?:boolean;
    label?:string;
    name:string;
    className?:string;
    custom?:boolean;
    value:string;
    disabled?:boolean;
    left?:boolean;
 }
 const BaseSelect = (props:BaseSelectProps)=>{
const [selected,setSelected] = useState<string | null>("");
const [list,setList] = useState<ItemProps[]>([]);
const [show,setShow] = useState<boolean>(false);

useEffect(()=>{
 if(selected !== "" && props.placeholder)
{
  setList(list.filter((a)=>a?.name !== props.placeholder));
}else{
  setList(list.filter((a)=>a?.name !== "Select an option"));
}
},[selected])

useEffect(()=>{
setList(props.list)
},[props.list])

useEffect(()=>{
setSelected(props.value)
},[props.value])

return <div className="relative">
  <input
required={props.required }
value={props?.value}
className="absolute top-[70px] opacity-0 "
onChange={()=>{
  return
}}
style={{zIndex:0,height:1,width:1}}
/>
{props?.label && <label htmlFor={props.name} className="flex items-center text-md font-medium text-gray-700" style={{position:"relative"}}><small ><b>{props?.label}</b></small>{props.required?<span className='text-red-600 text-[20px] ps-1'>*</span>:""}</label>}
<div className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm relative ${props.custom?"":"p-3"}  ${props.className?props.className:""}`}>
{props.custom?<div 
onClick={()=>{
  if(!props?.disabled)
  {
    setShow(true);
  }
}}
className={`h-[45px] p-3 ${selected?"text-black":"text-gray-500"} relative cursor-pointer overflow-hidden whitespace-nowrap`} 
>
<span >{selected?selected:props.placeholder}</span>
{props.disabled?<div className="absolute right-[0px] top-[0px] bg-white p-3" >
<Ban className="" size={15} color="red"/>
</div>:<div 
className="absolute right-[0px] top-[15px] bg-white px-[10px] py-[2px]"
>
  <ChevronDown className="" size={15} />
  </div>}
</div>:<select 
disabled={props?.disabled}
required={props.required}
onChange={({target})=>{
 setSelected(target.value);
 const found = list.find((a)=>a.value === target.value);
 if(found)
 {
    props.onValueChange(found);
 }

}}
className="form-select w-full border-0 outline-0" aria-label="Select an option">
<option 
disabled
 >{props.placeholder?props.placeholder:"Select an option"}</option>
{list.map((a,i)=><option 
className="text-black"
selected={selected === a.value} 
key={i} 
value={a.value} >{a.name}</option>)}
</select>}

{props.custom && show && !props?.disabled &&<div 
 onMouseLeave={()=>setShow(false)}
className={props?.left?`absolute z-40 left-0 min-w-48 mt-1 origin-top-left rounded-md shadow-sm bg-white ring-1 ring-gray-300 ring-opacity-5 group-hover:block overflow-hidden`:`absolute z-40 right-0 min-w-48 mt-1 origin-top-right rounded-md shadow-sm bg-white ring-1 ring-gray-300 ring-opacity-5 group-hover:block overflow-hidden`}>
 <div className="py-1 bg-white max-h-[200px] overflow-scroll "
 >
{list.map((a,i)=><div 
onClick={()=>{
    setShow(false);
    setSelected(a.title!)
    props.onValueChange(a)
}}
className={`text-black cursor-pointer hover:bg-gray-200 p-2 ${i !== 0 && i !== list.length?"border-t-1 border-t-gray-300":""}`}
key={i} 
 >{a.title}</div>)}
 </div>
</div>}
</div>
</div>
}
export default BaseSelect;