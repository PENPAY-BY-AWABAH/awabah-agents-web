/* eslint-disable react/jsx-no-undef */
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
import { CloseBtn } from '../baseCloseBtn';
// import { CloseBtn } from '@/asset/svg/closeBtn';
interface BaseInputProps {
  id?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  name: string;
  required?: boolean;
  value: string;
  onSelectedTime?: (time: string) => void;
  onSelectedDate?: (date: string) => void;
  errorMessage?: string;
  autoCapitalize?: boolean;
  type: "text" | "email" | "number" | "mobile" | "password" | "date" | "select" | "select-search";
  min?: number;
  max?: number;
  pattern?: RegExp;
  successMessage?: string;
  options?: SelectItemProps[];
  onValueChange?: (value: { value: string; name: string }) => void;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onSearch?: (value: { value: string }) => void;
  showOnly?: "date" | "time"
  format?: string;
  direction?: "left" | "right",
  className?:string;
  past?:boolean;
}
export default function BaseInputDate(props: BaseInputProps) {
  const [showDate, setShowDate] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);
  const thisInput = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null | undefined>(dayjs());
  const [selectedTime, setSelectedTime] = useState<Dayjs | null | undefined>(null);
  const [show, setShow] = useState<boolean>(false);
  const [savedTime, setSavedTime] = useState<string>("");
  const [savedValue, setSavedValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  useEffect(() => {
    if (props.pattern) {
      if (props.pattern.test(String(props.value).trim())) {
        setSuccess(true)
        setError(false)
        thisInput.current?.setAttribute("pattern", String(props.pattern))
      }
    }
    if (props.value) {
      setFocused(false)
    }
  }, [props.value, props.pattern])
  useEffect(() => {
    if (error && props.onValueChange) {
      props.onValueChange({ value: "", name: props.name })
    }
  }, [error])
  const onValueChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (props.onSearch) {
      setShow(true)
      return props.onSearch(target);
    }
    if (props.type == "select" && props.onValueChange) {
      props.onValueChange({ value: "", name: target.name })
      return setShow(true)
    }
    if (props.onValueChange) {
      props.onValueChange({ value: target.value, name: target.name })
    }
  }
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (props.onSelectedDate) {
      props.onSelectedDate(date!.toISOString())
    }
    setShowDate(false)
  };

  const handleTimeChange = (date: Dayjs | null) => {
    setSelectedTime(date);
  };
  return (<div
    onMouseLeave={() => {
      setShowDate(false)
      setShowTime(false)
      setShow(false)
      if (props.type == "select" && props.onValueChange) {
        props.onValueChange({ value: savedValue, name: props.name })
      }
    }}
    className="w-full relative">
   <div className="grid grid-cols-1 mb-3 relative">
  {props?.label && <label htmlFor={props.name} className="flex items-center text-md font-medium text-gray-700" style={{position:"relative"}}><small ><b>{props?.label}</b></small>{props.required?<span className='text-red-600 text-[20px] ps-1'>*</span>:""}</label>}
 <div className={`mt-1 block w-full border-[0.5px] 
            border-gray-300 h-[40px] p-[8px] relative rounded-md shadow-sm sm:text-sm relative ${props.className?props.className:""}`}>
<div className={`
${props.value ? "text-black" : "text-[#212529]"}
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
              <div
                className={`${props.label && "mt-[-10px] "} text-[14px] flex items-center gap-2`}>
                {props.showOnly == "date" || !props.showOnly ? <div
                  onClick={() => {
                    setShowDate(!showDate)
                  }}
                  onMouseEnter={() => setShowTime(false)}
                  className='flex-grow pt-[8px]'>{selectedDate ? selectedDate.format(props.format ? props.format : "ddd, MMM DD") : moment().add(1, "day").format(props.format ? props.format : "ddd, MMM YY")}</div> : null}
                {!props.showOnly && <div className='h-[18px] w-[1px] mx-2 bg-[#EDEDED]'></div>}
                {props.showOnly == "time" || !props.showOnly ? <div
                  onMouseEnter={() => setShowDate(false)}
                  onClick={() => {
                    setShowTime(!showTime)
                  }}
                  className='flex-grow pt-[8px]'>{savedTime ? savedTime : moment().format("hh:mm A")}</div> : null}
              </div>
            </div>
          </div>
        </div>
        <span
          onClick={() => {
            if (props.showOnly === "date") {
              setShowDate(!showDate);
            }
            if (props.showOnly === "time") {
              setShowTime(!showTime);
            }
          }}
          className='absolute right-2 top-[10px] '
        >
          {props.trailingIcon ? props.trailingIcon : <ChevronDown size={18} cursor={"pointer"} type='thin' />}
        </span>
      </div>
      {showTime && <div
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
                onClick={() => {
                  setShowTime(false)
                }} />
            </div>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              if (props.onSelectedTime) {
                setSavedTime(selectedTime!.format("hh:mm A"))
                props.onSelectedTime(selectedTime!.format("hh:mm A"))
              }
              setShowTime(false)
            }}
            className='
            mt-[10px]
            rounded-[16px]
            border-[0.5px] 
            border-gray-300
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
      {showDate && <div
        className={`hidden z-[20] text-black lg:block  absolute w-full ${props.direction === "left" ? "left-auto right-0 " : "left-0 right-auto "} bottom-auto top-[50px]  bg-white shadow-md  min-w-[320px] origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none`}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            defaultValue={dayjs()}
            value={selectedDate}
            onChange={handleDateChange}
            maxDate={dayjs().subtract(1, "d")}
          />
        </LocalizationProvider>
      </div>}
      {showTime && <div
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
            if (props.onSelectedTime) {
              setSavedTime(selectedTime!.format("hh:mm A"))
              props.onSelectedTime(selectedTime!.format("hh:mm A"))
            }
            setShowTime(false)
          }}
          className='
            mt-[10px]
            rounded-[16px]
            border-[0.5px] 
            border-gray-300
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
    </div>
    {/* mobile view */}
    {showDate && <div
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
                onClick={() => {
                  setShowDate(false)
                }} 
                />
            </div>
          </div>
          <LocalizationProvider
            dateLibInstance={DateCalendar}
            dateAdapter={AdapterDayjs}>
            <DateCalendar
              defaultValue={dayjs()}
              value={selectedDate}
              onChange={handleDateChange}
              minDate={dayjs().add(1, "d")}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>}
    <div className="text-[12px] h-1">
      {error && <div className='flex gap-1 items-center text-[#EF4836]'><ErrorIcon /><span>{props.errorMessage}</span></div>}
    </div>
  </div>
  )
}
