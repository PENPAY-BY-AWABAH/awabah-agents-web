/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { CONSTANT, ROUTES } from "../includes/constants";
import { useRouter } from "next/navigation";
import { BaseLoader } from "../components/baseLoader";
import { useIdleTimer } from 'react-idle-timer';
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
const [isIdle, setIsIdle] = useState(false);
const [remaining, setRemaining] = useState(0);

  const onIdle = () => {
    setIsIdle(true);
    console.log('User is idle');
    // Auto logout or show modal
  };

  const onActive = () => {
    setIsIdle(false);
    console.log('User is active');
  };
const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    timeout: 5 * 60 * 1000, // 5 minutes
    throttle: 500,
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove'
    ]
  });

useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
useEffect(()=>{
  if(isIdle)
  {
  navigate.replace(ROUTES.login)
  }
},[isIdle])
    if(!isLogin)
    {
      return <div className="grid grid-cols-1 h-screen bg-white">
        <BaseLoader modal size="lg" color="green" text="Authenticating user..."/>
      </div>
    }
    return <div className="grid grid-cols-1 h-screen overflow-hidden">
    <Navbar />
    <main className=" flex-1 h-screen overflow-scroll w-screen bg-white p-[16px] lg:pt-30 text-black lg:px-18 m-auto ">
    {children} 
    </main>
    </div>
  }
  export default Layout;