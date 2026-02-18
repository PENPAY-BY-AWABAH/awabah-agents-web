/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import useHttpHook from "@/app/includes/useHttpHook";
import { ROUTES } from "@/app/includes/constants";
import { BackIcon } from "@/app/assets/back-icon";
import BaseInput from "@/app/components/baseInput";
import BaseButton from "@/app/components/baseButton";
import { BaseHorizontalIndicator } from "@/app/components/baseHorizontalIndicator";
import BaseSelect from "@/app/components/baseSelect";
import { ItemProps } from "@/app/includes/types";
import { ReturnAllNumbers, ReturnComma } from "@/app/includes/functions";
import BaseInputDate from "@/app/components/baseInputDate";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

export interface EmploymentProps {
  email?: string;
  employerStateCode?: string;
  employerCityCode?: string;
  occupation?: string;
  dateOfAppointment?: string;
  dateOfCurrentEmployment?: string;
  serviceNo?: string;
  employerCountry?: string;
  employerStreetName?: string;
}

export const EmploymentPage = ({onClose,onSuccess,trackingId}:{onClose:()=>void;onSuccess:(tempPIN:string)=>void;trackingId:string}) => {
    const [index,setIndex] =  useState<number>(0)
    const navigate = useRouter();
    const { handleEmploymentDetails, loading } = useHttpHook();
    const [formData, setFormData] = useState<EmploymentProps>({
        email:"",
        employerStateCode:"",
        employerCityCode:"",
        occupation:"",
        dateOfAppointment:"",
        dateOfCurrentEmployment:"",
        serviceNo:"",
        employerCountry:"",
        employerStreetName:""
    })
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        handleEmploymentDetails({
        ...formData,
        trackingId:trackingId,
        dateOfCurrentEmployment:dayjs(formData.dateOfCurrentEmployment!).format("YYYY-MM-DD"),
        dateOfAppointment:dayjs(formData.dateOfAppointment!).format("YYYY-MM-DD")
    }).then((res) => {
    if (res.status) {
        onSuccess(res.data?.tempPIN)
    }
    })
    }
   
    return <div className="mt-[20px]">
    <div >
            <div className="text-[#009668] text-[14px] text-left mt-4">Employment details</div>
                <form onSubmit={handleSubmit}>
                        <BaseInput
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    occupation: value
                                })
                            }}
                            max={40}
                            label="Occupation"
                            placeholder="Enter occupation."
                        />
                        <BaseInput
                            type="text"
                            name="employerCityCode"
                            value={formData.employerCityCode}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    employerCityCode: value
                                })
                            }}
                            max={6}
                            label="Employer City Code"
                            placeholder="Enter Employer City Code."
                        />
                        <BaseInput
                            type="text"
                            name="employerStateCode"
                            value={formData.employerStateCode}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    employerStateCode: ReturnAllNumbers(value)
                                })
                            }}
                            max={6}
                            label="Employer StateCode"
                            placeholder="Enter Employer State Code."
                        />

                        <BaseInput
                            type="text"
                            name="phoneNumber"
                            value={formData.employerCountry}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    employerCountry: value
                                })
                            }}
                            max={30}
                            label="Employer Country"
                            placeholder="Enter Employer Country."
                        />
                        <BaseInputDate
                            showOnly="date"
                            type="date"
                            name="dateOfAppointment"
                            value={dayjs(formData.dateOfAppointment!).format("DD-MM-YYYY")}
                            direction="right"
                            format="DD-MM-YYYY"
                            leadingIcon={<Calendar />}
                            onSelectedDate={(value)=>{
                            setFormData({
                                    ...formData,
                                    dateOfAppointment: dayjs(value).toISOString()
                                })
                            }}
                            
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    dateOfAppointment: value
                                })
                            }}
                            max={16}
                            label="Date Of Appointment"
                            placeholder="Enter date Of Appointment."
                        />
                        <BaseInputDate
                        showOnly="date"
                            type="date"
                            name="dateOfCurrentEmployment"
                            value={dayjs(formData.dateOfCurrentEmployment!).format("DD-MM-YYYY")}
                            direction="right"
                            format="DD-MM-YYYY"
                            leadingIcon={<Calendar />}
                            onSelectedDate={(value)=>{
                            setFormData({
                                    ...formData,
                                    dateOfCurrentEmployment: dayjs(value).toISOString()
                                })
                            }}
                            required
                            onValueChange={({ value }) => {
                                
                            }}
                            max={30}
                           label="Date Of Current Employment"
                            placeholder="Enter date Of Current Appointment."
                        />
                        
                    <BaseInput
                            type="text"
                            name="serviceNo"
                            value={formData.serviceNo}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    serviceNo: value
                                })
                            }}
                            max={30}
                            label="Service No"
                            placeholder="Enter Service No."
                        />
                     <BaseInput
                            type="text"
                            name="employerStreetName"
                            value={formData.employerStreetName}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    employerStreetName: value
                                })
                            }}
                            max={90}
                            label="Employer Street Name"
                            placeholder="Enter Employer Street Name."
                        />
                        <BaseButton
                            loading={loading}
                            text="Next"
                            type="submit"
                        />
                </form>
    </div>
    </div>
}