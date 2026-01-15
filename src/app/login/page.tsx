"use client"
import { useRouter } from "next/navigation";
import { BackIcon } from "../assets/back-icon";
import BaseInput from "../components/baseInput";
import BaseToggleBtn from "../components/baseCheckBox";
import { FormEvent, useEffect, useState } from "react";
import BaseButton from "../components/baseButton";
import { CONSTANT, ROUTES } from "../includes/constants";
import Link from "next/link";
import useHttpHook from "../includes/useHttpHook";
import { LoginProps } from "../includes/types";

const Page = ()=>{
    const [showForgotPassword,setShowForgotPassword] = useState<boolean>(false)
    const navigate = useRouter();
    const {handleLogin,loading} = useHttpHook();
    const [formData,setFormData] = useState<LoginProps>({
        email:"",
        password:""
    })
    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault()
        handleLogin(formData).then((res)=>{
            if(res.status)
            {
              navigate.replace(ROUTES.dashboard) 
            }
        })
    }
    useEffect(()=>{
     const token =localStorage.getItem(CONSTANT.LocalStore.token);
     if(token)
     {
        navigate.replace(ROUTES.dashboard) 
     }
    },[])
    return <div className="bg-white min-h-full px-[100px] py-[60px]">
     <div className="mb-6">
             <button 
             onClick={()=>{
             navigate.back();
             }}
             className="flex items-center gap-2 cursor-pointer">
                 <BackIcon />
                 <div className="text-black text-[18px]">Back</div>
             </button>
             </div>
       <div className="m-auto items-center text-center   ">
      <div  className="m-auto items-center text-center  rounded-[30px] min-h-[400px] shadow w-[500px] p-[30px] pb-[60px]">
      <div className="text-black text-[24px] font-bold text-center">Login</div>
      <form onSubmit={handleSubmit}>
        <BaseInput 
        type="text"
        name="email"
        value={formData.email}
        required
        onValueChange={({value})=>{
            setFormData({
                ...formData,
                email:value
            })
        }}
        label="Email"
        placeholder="Enter Email."
        />
        <BaseInput 
        required
        type="password"
        name="password"
        value={formData.password}
        onValueChange={({value})=>{
            setFormData({
                ...formData,
                password:value
            })
        }}
        label="Password"
        placeholder="Enter Password."
        />
        <div className="flex items-center gap-3 text-black mb-[30px]">
            <BaseToggleBtn
            onChange={()=>{

            }}
            type="checkbox"
            value={true}

            />
            <span className="text-[14px">Remember me</span>
            <div className="flex items-center justify-end flex-1">
             <Link 
            href={ROUTES.forgotPassword}
                className="text-emerald-600 text-[14px] cursor-pointer"
                >
                Forgot Password
                </Link>
            </div>
        </div>
        <BaseButton
        loading={loading}
        text="Log in"
        type="submit"
        />
        <div className="flex items-center justify-center mt-[30px] gap-1">
            <span className="text-[14px] text-black">Don`t have an account?</span>
            <Link 
            href={ROUTES.register}
            className="text-[14px] text-[#009668]"
            >
            Create Account
            </Link>
        </div>
      </form>
     </div>
     </div>
    </div>
}
export default Page;