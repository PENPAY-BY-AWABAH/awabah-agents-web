"use client"
import React, { ChangeEventHandler, ReactNode, useState } from 'react'
import { SearchIcon } from 'lucide-react';
interface BaseInputSearchProps {
    id?:string;
    placeholder?:string;
    name:string;
    required?:boolean;
    value:string;
    autoCapitalize?:boolean;
    max?:number;
    pattern?:string;
    className?:string;
    trailingIcon?:ReactNode | string;
    onValueChange:ChangeEventHandler<HTMLInputElement>;
}
export default function BaseInputSearch(props:BaseInputSearchProps) {
 const [error,setError] = useState<boolean>(false);

 return (<div className="w-full h-[55px] text-black" >
 <div className={`flex relative item-center ${props.className?props.className:""} `} style={{borderColor:error?"#EF4836":"#EDEDED",borderRadius:50,borderWidth:1,height:"100%",width:"100%"}}>
  <div className='p-[14px] absolute top-[0px] left-[0px] flex item-center justify-center'>
  <SearchIcon />
  </div>
  <input 
    type={"text"}
    style={{paddingLeft:40}}
    className={"font-inter text-[14px] border-none h-full w-full rounded-[50px] p-3 "} 
    required={props.required}
    id={props.id} 
    name={props.name} 
    maxLength={props.max}
    value={props.value}
    placeholder={props.placeholder}
    onChange={props.onValueChange}
    onError={()=>{
      setError(true)
    }}
   />
   <div className='h-full p-2 flex item-center justify-center'>
   {props?.trailingIcon}
   </div>
 </div>
</div>
  )
}