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

    useEffect(()=>{
      const token = localStorage.getItem(CONSTANT.LocalStore.token);
      if(token)
      {
        return;
      }
      const path = window.location.pathname;
      if (path.includes(ROUTES.self_registered)) {
        return;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const referrer = urlParams.get("referrer");
      if(referrer)
      {
        localStorage.setItem(CONSTANT.LocalStore.referrer, referrer);
        navigate.replace(ROUTES.register);
        return;
      }
      navigate.replace(ROUTES.login);
    },[navigate])
const [isIdle, setIsIdle] = useState(false);
const [remaining, setRemaining] = useState(0);

  const onIdle = () => {
    // setIsIdle(true);
  };

  const onActive = () => {
    setIsIdle(false);
    console.log('User is active');
  };
const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    timeout: 3 * 60 * 1000, // 3 minutes
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
  }, [getRemainingTime]);
useEffect(()=>{
  if(isIdle)
  {
  localStorage.clear();
  navigate.replace(ROUTES.login)
  }
},[isIdle, navigate])

   
    return <div className="grid grid-cols-1 h-screen overflow-hidden">
    <Navbar />
    <main className=" flex-1 h-screen overflow-scroll w-screen bg-white p-[16px] lg:pt-30 text-black lg:px-18 m-auto ">
    {children} 
    </main>
    </div>
}
export default Layout;
