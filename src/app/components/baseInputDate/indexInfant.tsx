/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { ChangeEvent, ChangeEventHandler, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import "./style.css"
import { ErrorIcon } from './component/errorIcon';
import { ChevronDown } from 'lucide-react';
import { SelectItemProps } from '@tremor/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs, } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { CloseBtn } from '@/asset/svg/closeBtn';
import { NativeCustomEvent } from '../baseDropDown';
interface BaseInputProps {
    id?:string;
    label?:string;
    disabled?:boolean;
    placeholder?:string;
    name:string;
    required?:boolean;
    value:string;
    onSelectedTime?:(time:string)=>void;
    onSelectedDate?:(date:string)=>void;
    errorMessage?:string;
    autoCapitalize?:boolean;
    type:"text"|"email"|"number"|"mobile"|"password" | "date" | "select" | "select-search";
    min?:number | null;
    max?:number | null;
    limit?:number | null;
    pattern?:RegExp;
    successMessage?:string;
    options?:SelectItemProps[];
    onValueChange?:(value:{value:string;name:string})=>void;
    leadingIcon?:ReactNode;
    trailingIcon?:ReactNode;
    onSearch?:(value:{value:string})=>void;
    showOnly?:"date"|"time"
    format?:string; 
    direction?:"left"|"right";
    eventName?:string;
    passengerType?:"Adult"|"Infant"|"Child";
    minDate?:string;
}
export default function BaseInputAltInfant(props:BaseInputProps) {
  const [showDate,setShowDate] = useState<boolean>(false);
  const [showTime,setShowTime] = useState<boolean>(false);
  const thisInput = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null | undefined>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Dayjs | null | undefined>(null);
  const [show, setShow] = useState<boolean>(false);
  const [savedTime, setSavedTime] = useState<string>("");
  const [savedValue, setSavedValue] = useState<string>("");
 const [error,setError] = useState<boolean>(false);
 const [success,setSuccess] = useState<boolean>(false);
 const [focused,setFocused] = useState<boolean>(false);
useEffect(()=>{

if(props.pattern)
{
  if(props.pattern.test(String(props.value).trim()))
  {
    setSuccess(true)
    setError(false)
    thisInput.current?.setAttribute("pattern",String(props.pattern))
  }
}

if(props.value)
{
  setFocused(false);
  setSelectedDate(dayjs(props.value))
  setSavedValue(props.value)
}

},[props.value,props.pattern])
useEffect(()=>{
  if(error && props.onValueChange)
  {
  props.onValueChange({value:"",name:props.name})
  }
},[error])
const onValueChange = ({target}: ChangeEvent<HTMLInputElement>)=>{
  if(props.onSearch)
 {
  setShow(true)
  return props.onSearch(target);
 }
  if(props.type == "select" && props.onValueChange)
    {
      props.onValueChange({value:"",name:target.name})
      return setShow(true)
    }
    if(props.onValueChange)
    {
     props.onValueChange({value:target.value,name:target.name})
    }
}
const handleDateChange = (date: Dayjs | null) => {
  setSelectedDate(date);
  if(props.onSelectedDate)
  {
  props.onSelectedDate(date!.toISOString())
  }
  setShowDate(false)
};

const handleTimeChange = (date: Dayjs | null) => {
  setSelectedTime(date);
};

const handleNativeEvent = useCallback((event: NativeCustomEvent) => {
      // Check if the event object has the detail property (where our custom data lives)
      if (event.detail) {
        const { timestamp } = event.detail;
        setShowDate(true)

      }
    }, []);

  useEffect(() => {
    if(props?.eventName){
    window.addEventListener(props.eventName, handleNativeEvent);
    }
    return () => {
      if(props?.eventName){
      window.removeEventListener(props?.eventName, handleNativeEvent);
    }
  }
  }, [handleNativeEvent,props.eventName]);
  let minSelectableDate = dayjs().subtract(100, 'years');
  let maxSelectableDate = dayjs().add(18, 'years');
  
  if(props?.limit !== null)
  {
  if(props?.passengerType === "Infant")
  {
      minSelectableDate = dayjs().subtract(2, 'years');
      maxSelectableDate = dayjs();
  }else if(props?.passengerType === "Child")
  {
      minSelectableDate = dayjs().subtract(2, 'years');
      maxSelectableDate = dayjs().subtract(1, 'year');
  }else if(props?.passengerType === "Adult")
  {
      maxSelectableDate = dayjs().subtract(18, 'year');
      // minSelectableDate = dayjs().subtract(2, 'years');
  }else if(parseInt(String(props?.limit)) >= 18)
  {
      maxSelectableDate = dayjs().subtract(18, 'year');
  }
}
 return (<div 
  onMouseLeave={()=>{
    setShowDate(false)
    setShowTime(false)
    setShow(false)
    if(props.type == "select" && props.onValueChange)
      {
        props.onValueChange({value:savedValue,name:props.name})
      }
  }}
 className="w-full text-black ">
<div className='relative' >
 {props.type === "date" ?<div
  className={`
  rounded-[16px]
border-[1px]
 border-[#EDEDED]
bg-white
h-[45px]
flex
items-center
cursor-pointer
px-[10px]
`}
  >
<div className={`
${props.value?"text-black":"text-[#212529]"}
ellipsis
font-inter
text-[16px]
font-[400]
leading-[24px]
tracking-[0.5px]
relative
  `}>
    <div className='flex items-center w-full gap-2 font-inter px-1' >
    {props.leadingIcon && props.leadingIcon}
    <div className='relative '>
     {props.label &&<div className='text-[10px] mt-[0px] text-[#707070] w-full text-left'>{props.label}</div>}
    <div 
    className={`${props.label &&"mt-[-10px] "} text-[14px] flex items-center gap-2`}>
      {props.showOnly == "date" || !props.showOnly?<div 
      onClick={()=>{
        setShowDate(!showDate)
      }}
      onMouseEnter={()=>setShowTime(false)}
      className='flex-grow'>{selectedDate?selectedDate.format(props.format?props.format:"ddd, MMM DD"):dayjs().add(1,"day").format(props.format?props.format:"ddd, MMM YY")}</div>:null}
      {!props.showOnly &&<div className='h-[18px] w-[1px] mx-2 bg-[#EDEDED]'></div>}
      {props.showOnly == "time"  || !props.showOnly?<div 
      onMouseEnter={()=>setShowDate(false)}
      onClick={()=>{
        setShowTime(!showTime)
      }}
      className='flex-grow'>{savedTime?savedTime:moment().format("hh:mm A")}</div>:null}
    </div>
    </div>
    </div>
    </div>
  <span
  onClick={()=>{
    if(props.showOnly === "date")
    {
    setShowDate(!showDate);
    }
    if(props.showOnly === "time")
      {
      setShowTime(!showTime);
      }
  }}
   className='absolute right-2 '
   >
    {props.trailingIcon?props.trailingIcon:<ChevronDown size={18} cursor={"pointer"} type='thin' />}
   </span>
  </div>:<div className={`
 flex
 items-center
  h-[48px] 
  gap-[5px] 
  overflow-hidden 
  w-full border-[1px]  px-2 rounded-[16px] ${error?"border-[#EF4836] bg-[#FFE8E5]":focused?"border-[#F8B02B]":"border-[#EDEDED]"}  transition-all relative `} >
    {props.leadingIcon && <span className="w-[40px] flex items-center justify-center">{props.leadingIcon}</span>}
    <div className={`absolute top-[0px] ${props.leadingIcon?"left-[35px] w-[80%]":"w-[90%] left-[16px]"}  `}>
  {props.label &&<div className='font-inter text-[10px] mb-1 mt-2 m-0 text-[#707070] text-left'>{props.label}</div>}
    <input
    onFocus={()=>{
      setFocused(true)
    }}
    onBlur={()=>{
      setFocused(false)
      if(props.pattern && props.value)
        {
          if(props.pattern.test(String(props.value).trim()))
          {
            setError(false)
          }else{
            setError(true)
          }
        }
    }}
    onInvalid={(e)=> {
      setError(true)
      return (e.target as HTMLInputElement).setCustomValidity(props.errorMessage?props.errorMessage:`This field is required.`)
    }}
    onInput={(e) => {
      setError(false)
      return (e.target as HTMLInputElement).setCustomValidity('')
    }}
    id={props.id} 
    name={props.name} 
    maxLength={(props.max && props.type !== "number") ? props.max : undefined}
    minLength={(props.min && props.type !== "number") ? props.min : undefined}
    value={props.value}
    disabled={props.disabled}
    onChange={onValueChange}
    onError={()=>{
      setError(true)
  }}
  required={props.required}
  type={props.type}
  placeholder={props.placeholder}
  className="font-inter focus:border-white focus:shadow-none  focus:outline-none text-[14px] outline-none mt-[-5px] px-0 block text-black border-0 w-full h-full bg-transparent " 
  style={{outline:0,borderWidth:0}}
  />
    </div>
 </div>}
{/* desktop view */}
{showTime &&<div 
className='fixed z-[12] lg:hidden top-0 left-0 right-0 bottom-0 w-full h-full bg-[#00000026] ' >
<div className={`absolute bottom-0 bg-white p-[16px] pt-[20px] pb-[100px] w-full rounded-t-[32px] ${showTime ? 'animate-slideInUp' : 'animate-slideOutDown'}
          `}
          style={{
            transition: 'transform 0.3s ease-in-out', // You can adjust timing here
          }} >
 <div className='relative mb-[30px]'>
        <div className='
        text-[#2E2E2D]
        font-milMedium
        text-[20px]
        font-[500]
        leading-[24px]
        tracking-[-0.32px]
        h-[20px]
        '>
          
        </div>
        <div className=' 
        rounded-[32px]
      bg-[#F7F7F7]
      h-[40px]
      w-[40px]
      flex
      items-center
      justify-center
        absolute top-0 right-0'>
        <CloseBtn 
        color='#F7F7F7'
        onClick={()=>{
          setShowTime(false)
        }}/>
          </div>
        </div>
      <LocalizationProvider 
      dateAdapter={AdapterDayjs}>
      <TimePicker 
      defaultValue={dayjs()}
      value={selectedTime}
      onChange={handleTimeChange} 
      className='w-full'
      />
    </LocalizationProvider>
 <button
        type='button'
          onClick={() => {
            if(props.onSelectedTime)
              {
              setSavedTime(selectedTime!.format("hh:mm A"))
              props.onSelectedTime(selectedTime!.format("hh:mm A"))
              }
            setShowTime(false)
          }}
          className='
            mt-[10px]
            rounded-[16px]
            border-[1px] border-[#4B56A6]
            h-[44px]
            w-full
            text-[16px]
            text-[#4B56A6]
            font-[500]
            font-inter
            leading-[20px]
            tracking-[0.32px]
            '
  >Done</button>
 </div>
 </div>}
 {showDate &&<div 
 className={`hidden z-[20] lg:block  absolute w-full ${props.direction === "left"?"left-auto right-0 ":"left-0 right-auto " }bottom-auto top-[50px]  bg-white shadow-md  min-w-[320px] origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none`}
 >
  {props.passengerType}
  {String(props.limit) === "0"?<ChildCalendar
      selectedDate={selectedDate!}
      handleDateChange={handleDateChange}
      />:<LocalizationProvider 
      dateAdapter={AdapterDayjs}>
      <DateCalendar 
      defaultValue={props.limit?dayjs().subtract(props.limit,"years"):dayjs()}
      value={selectedDate}
      onChange={handleDateChange} 
      minDate={minSelectableDate}//props?.limit?dayjs().subtract(100,"years"):dayjs().add(1,"d")}
      maxDate={maxSelectableDate}//props?.limit?dayjs().subtract(props.limit,"years"):dayjs().add(12,"year")}
      />
    </LocalizationProvider>}
 </div>}
 {showTime &&<div 
 className={`hidden z-[20] lg:block lg:absolute w-[200px] left-auto bottom-auto p-3 top-[50px] right-0  bg-white shadow-md  origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none `}
 >
<div className=''>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker 
      defaultValue={dayjs()}
      value={selectedTime}
      onChange={handleTimeChange} 
      />
    </LocalizationProvider>
 </div>
 <button
        type='button'
          onClick={() => {
            if(props.onSelectedTime)
              {
              setSavedTime(selectedTime!.format("hh:mm A"))
              props.onSelectedTime(selectedTime!.format("hh:mm A"))
              }
            setShowTime(false)
          }}
          className='
            mt-[10px]
            rounded-[16px]
            border-[1px] border-[#4B56A6]
            h-[44px]
            w-full
            text-[16px]
            text-[#4B56A6]
            font-[500]
            font-inter
            leading-[20px]
            tracking-[0.32px]
            '
        >Done</button>
 </div>}
 {show && props.options?.length !== 0?<div 
   className={`lg:absolute z-[10] bottom-0 w-full  left-0 lg:left-auto lg:bottom-auto max-h-[250px] ${Array.isArray(props.options)?"overflow-x-scroll":""} top-[50px] lg:right-0 min-h-10 bg-white shadow-md min-w-[320px] lg:min-w-[200px]  lg:max-w-[450px] origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none `}
   >
  {props.options?.map((item,i)=><div
  onClick={()=>{
    if(props.onValueChange)
    {
      setSavedValue(item.value)
      props.onValueChange({value:item.value!,name:props.name})
    }
    setShow(false)
  }}
  key={i} className='p-2 px-5 cursor-pointer hover:bg-[#F8F9FA]
 text-[#16191D]
font-inter
text-[14px]
font-[400]
leading-[20px]
tracking-[0.014px]
flex 
items-center
text-left
gap-2
  '>
{item.icon &&<img
      alt='fl'
      src={"data:image/png;base64,"+item.icon}
      className='h-[12px] w-[21px] me-[4px]  rounded-sm text-left'
      />}
 {item.title}
  </div>)}
   </div>:null}
 </div>
 {/* mobile view */}
{showDate &&<div 
// onClick={()=>setShowDate(false)}
className='fixed z-[10] lg:hidden top-0 left-0 right-0 bottom-0 w-full h-full bg-[#00000026] '>
<div 
className={`
  fixed bottom-0 w-full left-0 bg-white rounded-t-[32px] right-0  ${showDate ? 'animate-slideInUp' : 'animate-slideOutDown'}
  `}
style={{
        transition: 'transform 0.3s ease-in-out', // You can adjust timing here
       }}>
<div className=' w-full p-[16px] '>
<div className='relative mb-[30px]'>
<div className='
        text-[#2E2E2D]
        font-milMedium
        text-[20px]
        font-[500]
        leading-[24px]
        tracking-[-0.32px]
        '>
          
        </div>
        <div className=' 
        rounded-[32px]
      bg-[#F7F7F7]
      h-[40px]
      w-[40px]
      flex
      items-center
      justify-center
        absolute top-0 right-0'>
        <CloseBtn 
        color='#F7F7F7'
        onClick={()=>{
          setShowDate(false)
        }}/>
          </div>
        </div>
      
      {String(props.limit) === "0"?<ChildCalendar
      selectedDate={selectedDate!}
      handleDateChange={handleDateChange}
      />:
      <LocalizationProvider 
      dateLibInstance={DateCalendar}
      dateAdapter={AdapterDayjs}>
      <DateCalendar 
      defaultValue={dayjs()}
      value={selectedDate}
      onChange={handleDateChange}
      minDate={props?.limit?dayjs().subtract(props?.limit,"years"):dayjs().add(1,"d")}
      maxDate={props?.limit?dayjs().subtract(1,"d"):dayjs().add(1,"year")}
      />
    </LocalizationProvider>}
      </div>
  </div>
</div>}
<div className="text-[12px] h-1">
{error && <div className='flex gap-1 items-center text-[#EF4836]'><ErrorIcon /><span>{props.errorMessage}</span></div>}
</div>
</div>
  )
}
const ChildCalendar = ({selectedDate,handleDateChange}:{selectedDate:Dayjs| undefined,handleDateChange:(date:Dayjs | null)=>void})=>{
  return  <LocalizationProvider 
      dateLibInstance={DateCalendar}
      dateAdapter={AdapterDayjs}>
      <DateCalendar 
      defaultValue={dayjs()}
      value={selectedDate}
      onChange={handleDateChange}
      minDate={dayjs().subtract(2,"years")}
      // maxDate={props?.limit?dayjs().subtract(1,"d"):dayjs().add(1,"year")}
      />
    </LocalizationProvider>
}