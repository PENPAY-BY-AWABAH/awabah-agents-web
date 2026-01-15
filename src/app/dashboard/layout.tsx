"use client"
import { Navbar } from "../components/Navbar";

function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <div className="grid grid-cols-1 ">
    <Navbar />
    <main className=" flex-1 h-screen overflow-scroll w-screen bg-white pt-30 text-black px-18 m-auto ">
    {children} 
    </main>
    </div>
  }
  export default Layout;