"use client"
import BaseButton from "@/app/components/baseButton";
import BaseInput from "@/app/components/baseInput";
import { BaseLoader } from "@/app/components/baseLoader";
import BaseModal from "@/app/components/baseModal";
import useHttpHook, { ApiResponse } from "@/app/includes/useHttpHook";
import { useState } from "react";

export const ValidateRSAPinModal = ({
    onClose,
}:{
    onClose:()=>void;
})=>{
    const {validateNIN,handleDeleteAccount} = useHttpHook()
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ApiResponse | null>(null)
    const [formData, setFormData] = useState<{ nin: string; name?: string;pfaName?:string;rsaPin?:string;deleteAccount?:boolean }>({ nin: "", name:"",pfaName:"",rsaPin:"",deleteAccount:false })

    return <BaseModal
        title={formData.deleteAccount ? "Delete Account" : "Get RSA Registration Details"}
        onClose={() => {
            if (!loading){
                if(formData.deleteAccount){
                    return setFormData({...formData,
                        deleteAccount:false,
                        pfaName:"",
                        name:"",
                        rsaPin:""
                    })
                }
                onClose()
            }
        }}
        type="sm"
    >
        <div className="grid gap-3">
        {!formData.deleteAccount && <div className="">
            <BaseInput
                required
                label="NIN"
                placeholder="Enter NIN"
                type="text"
                name="nin"
                value={formData.nin}
                max={11}
                onValueChange={({ value }) => {
                    setFormData((prev) => ({
                        ...prev,
                        nin: String(value).toUpperCase().trim(),
                    }))
                }}
            />
            <BaseButton
                type="button"
                loading={loading}
                text="Verify"
                onClick={() => {
                    setLoading(true)
                    setResult(null)
                    validateNIN(formData.nin).then((res) => {
                        setLoading(false)
                        if(res.status)
                        {
                        setFormData({...formData,...res.data})
                        }
                    })
                }}
            />
            </div>}
            {result && <div className={`p-3 rounded-[12px] ${result.status ? "bg-green-50" : "bg-red-50"}`}>
                <div className="font-bold text-black">{result.status ? "Valid" : "Not Valid"}</div>
                <div className="text-black">{result.message}</div>
            </div>}

            {formData.name && <div className="p-3 rounded-[12px] bg-slate-50 grid gap-2">
                <div className="flex gap-2 text-black">
                    <div className="font-bold">Name:</div>
                    <div>{formData.name}</div>
                </div>
                {formData.rsaPin &&<div className="flex gap-2 text-black">
                    <div className="font-bold">RSA PIN:</div>
                    <div>{formData.rsaPin}</div>
                </div>}
                {formData.pfaName && <div className="flex gap-2 text-black">
                    <div className="font-bold">PFA Name:</div>
                    <div>{formData.pfaName}</div>
                </div>}
                <div className="gap-2 text-black">
                    <div className="p-3 bg-red-200 rounded-[12px]">PPP PIN was not generated, do you want to delete account?</div>
                    <div className="flex gap-4  mt-4" >
                    <button className="font-bold w-[100px] flex items-center justify-center gap-2 cursor-pointer bg-[#009668] text-white px-4 py-1 rounded-[5px]" 
                    onClick={()=>{
                        setLoading(true)
                        handleDeleteAccount(formData.nin).then((res) => {
                            setLoading(false)
                            if(res.status)
                            {
                                onClose()
                            }
                        })
                    }}>
                        {loading &&<BaseLoader color="white" size="md" modal={false}  />}
                        Yes</button>
                    <button className="font-bold w-[100px] cursor-pointer flex items-center justify-center gap-2 cursor-pointer bg-red-500 text-white px-4 py-1 rounded-[5px]" 
                    onClick={()=>{
                     setFormData({...formData,
                        deleteAccount:false,
                        pfaName:"",
                        name:"",
                        rsaPin:""
                    })
                    }}>No</button>
                </div>
                </div>
            </div>}
        </div>
    </BaseModal>
}
