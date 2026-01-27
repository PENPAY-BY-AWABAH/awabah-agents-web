/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { CONSTANT, ROUTES } from "../includes/constants";
import { useRouter } from "next/navigation";
import { BaseLoader } from "../components/baseLoader";

function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const navigate = useRouter();
    const [isLogin,setLogin] = useState<boolean>(false)
    useEffect(()=>{
      const token = localStorage.getItem(CONSTANT.LocalStore.token);
      if(token)
      {
        setLogin(true)
      }else{
        navigate.replace(ROUTES.login)
      }
    },[isLogin])
    if(!isLogin)
    {
      return <div className="grid grid-cols-1 h-screen bg-white">
        <BaseLoader modal size="lg" color="green" text="Authenticating user..."/>
      </div>
    }
    return <div className="grid grid-cols-1 ">
    <Navbar />
    <main className=" flex-1 h-screen overflow-scroll w-screen bg-white pt-30 text-black px-18 m-auto ">
    {children} 
    </main>
    </div>
  }
  export default Layout;