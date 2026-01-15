"use client"
import { useEffect, useState } from "react";
import { CardOne } from "./dashboard/components/card1";
import { COLOURS, CONSTANT, ROUTES } from "./includes/constants";
import { SlideItemProp } from "./includes/types";
import { CardTwo } from "./dashboard/components/card2";
import { CardThree } from "./dashboard/components/card3";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const navigate = useRouter();
  const [slider,setSlider] = useState<SlideItemProp[]>([
    {
      graphics:<CardOne />,
      title:"Become an Awabah Agent",
      description:"Help new users get started on Awabah and earn commissions for every successful onboarding."
    },
    {
      graphics:<CardTwo />,
      title:"Onboard & Track Users",
      description:"Register new users, monitor their verification status, and track when your commissions are earned — all from one dashboard."
    },
    {
      graphics:<CardThree />,
      title:"Earn & Withdraw Commissions",
      description:"Earn 300Naira per onboarding and Convert your earned commissions to cash and withdraw directly to your bank account when eligible."
    }
  ]);
  const [showOnboardingBtn,setShowOnboardingBtn] = useState<boolean>(false);
  const [selectedIndex,setSelectedIndex] = useState<number>(0);
  const [stop,setStop] = useState<boolean>(false);
  useEffect(()=>{
  //   const intervalTime = setInterval(()=>{
  //     setSelectedIndex((count)=>{
  //       if(count > slider.length - 2)
  //       {
  //         setShowOnboardingBtn(true)
  //         return 0
  //       }
  //       return count + 1
  //     })
  //   },4000)
  // return ()=>{
  //   clearInterval(intervalTime);
  // }
  },[stop])
  useEffect(()=>{
    const token =localStorage.getItem(CONSTANT.LocalStore.token);
       if(token)
       {
          navigate.replace(ROUTES.dashboard) 
       }
      },[])
  return (<div className="min-h-screen overflow-scroll pb-[140px] items-center justify-center bg-white font-sans grid grid-cols-1 ">
     <div className="m-auto items-center text-center  h-[500px] ">
     {slider.filter((a,i)=>selectedIndex === i).map((item,index)=>{
      return <div key={index} className="m-auto items-center text-center  rounded-[30px] shadow w-[400px] p-[30px] pb-[60px]">
     <div className="m-auto items-center text-center justify-center flex overflow-hidden">
        {item.graphics}
     </div>
     <div className="flex items-center justify-center  mt-[50px] gap-2">
      {slider?.map((item,index)=><button 
      onClick={()=>{
        setSelectedIndex(index)
      }}
      key={index} 
      className={`cursor-pointer ${selectedIndex === index?"bg-green-600":"bg-[#C4C4C4]"}  h-[5px] ${selectedIndex === index?"w-[30px]":"w-[15px]"} rounded-[20px]`}></button>)}
      </div>
     <div >
      <div className={``}></div>
     </div>
     <div className="w-[300px] m-auto items-center text-center mt-8" >
     <div className="text-black text-[30px] w-[80%] text-center m-auto leading-[32px] ">
     {item.title}
     </div>
     <div className="text-[#4D4D4DD9] text-[14px] mt-3 ">
    {item.description}
     </div>
     </div>
     </div>})}
     </div>
      <div className="flex p-10 items-center fixed top-0 left-0  w-full">
      <div >
      <Link 
       href={ROUTES.login}
      className="rounded-[12px] text-[16px] cursor-pointer bg-[#C4C4C440] px-[20px] py-2 text-black text-[18px]"
      >
      Skip
      </Link>
     </div>
      <div className="flex-1 ">
     </div>
      {!showOnboardingBtn?<div >
       <button 
       onClick={()=>{
          setSelectedIndex((count)=>{
        if(count > slider.length - 2)
        {
          setShowOnboardingBtn(true)
          return 0
        }
        return count + 1
      })
       }}
      className={`rounded-[12px] text-[16px] cursor-pointer bg-[#009668] px-[20px] py-2 text-${COLOURS.white} text-[18px]`}
      >
      Next
      </button>
     </div>:<div className="flex gap-4">
       <Link 
       href={ROUTES.login}
      className={`rounded-[12px] text-[16px] cursor-pointer border-[1px] border-[#009668] px-[20px] py-2 text-[#009668] text-[18px]`}
      >
      Log In
      </Link>
      <Link 
      href={ROUTES.register}
      className={`rounded-[12px] text-[16px] cursor-pointer bg-[#009668] px-[20px] py-2 text-white text-[18px]`}
      >
      Create Account
      </Link>
     </div>}
     </div>
    </div>
  );
}
