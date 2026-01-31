/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { ChangeEvent, useState } from 'react'
import './style.css';
import { FieldChangePayload } from '@/app/includes/types';
import { ValidateEmail } from '@/app/includes/functions';
import { Ban, BlocksIcon, EyeClosed, EyeIcon } from 'lucide-react';
import { EyeOpen } from '@/app/assets/eyes';

interface BaseInputProps {
    arrayList?:boolean;
    filterValue?:(d:any)=>void;
    error?:any;
    id?:string;
    label?:string;
    disabled?:boolean;
    placeholder?:string;
    name:string;
    required?:boolean;
    value:any;
    type:"text"|"email"|"number"|"mobile"|"password" | "date" |"file" |"text-area";
    min?:number;
    max?:number;
    className?:string;
    pattern?:string;
    onValueChange:(payload: FieldChangePayload) => void | null;
    options?:{value:string;name:string;}[];
    onBlur?:(value:string)=>void;
}
export default function BaseInput(props:BaseInputProps) {
 const [toggleEye,setToggleEye] = useState(false);
const stringList:string[] = [];
function handleChange(e: ChangeEvent<HTMLInputElement>) {
  if(props.type === "file")
  {
    return ;
  }
  props.onValueChange({
    field: e.target.name,
    value: e.target.value,
  });
}
if(typeof props.value === "string")
{
  String(props.value).split(",").map((a,i:number)=>{
  if(ValidateEmail(a))
  {
    stringList.push(a)
  }
  return a;
})
}
 return (<div className="grid grid-cols-1 mb-3">
  {props?.label && <label htmlFor={props.name} className="flex items-center text-md font-medium text-gray-700" style={{position:"relative"}}><small ><b>{props?.label}</b></small>{props.required?<span className='text-red-600 text-[20px] ps-1'>*</span>:""}</label>}
 <div className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm relative ${props.className?props.className:""}`}>
  {props.arrayList && <div className='emailContainer'>
    {stringList.map((a:string,i:number,self:string[])=>{
      return <span className='emailItem' key={i} >{a} <button type="button" onClick={()=>{
        if(props.filterValue)
        {
        props.filterValue(self.filter((b,o)=>i !== o))
        }
      }} className="btn-close btn-close-b" ></button>
      </span>
      
    })}
    </div>}
  {props.type ==="text-area"?<textarea 
  placeholder={props.placeholder}
  required={props.required}
   id={props.id} 
   name={props.name} 
   maxLength={props.max}
   minLength={props.min}
   value={props.value}
   disabled={props.disabled}
   onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(`${props.name} is required.`)}
   onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
  className='w-full h-full p-3'
  onChange={({target})=>{
    props.onValueChange({
      field: target.name,
      value: target.value,
    });
  }}
 
  >
    
  </textarea>:<input 
  type={props.type === "password"?toggleEye?"text":"password":props.type}
   className={"w-full h-full px-3 py-3 border-0  focus:ring-green-500 focus:border-green-500 text-black text-[14px] "} 
   required={props.required}
   id={props.id} 
   name={props.name} 
   maxLength={props.max}
   minLength={props.min}
   value={props.value}
   disabled={props.disabled}
   placeholder={props.placeholder}
   onChange={handleChange}
   pattern={props.pattern}
   onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(`${props.name} is required.`)}
   onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
   onBlur={()=>{
    if(props?.onBlur)
    {
      props.onBlur(props.value)
    }
  }}
  />}
   {props.disabled?<span className='input-icon pt-2 bg-white'>
    <Ban color="red" size={15} />
   </span>:props.type === "password" && <span
   onClick={()=>setToggleEye(!toggleEye)} className='input-icon pt-[5px]'>
    {toggleEye?<EyeOpen />:<EyeIcon />} 
   </span>}
</div>
{props?.error?<div className='text-red-600' >{props.error}</div>:null}
</div>
  )
}