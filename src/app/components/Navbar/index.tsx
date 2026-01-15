import { BellIcon } from "@/app/assets/bell-icon"
import { CommissionIcon } from "@/app/assets/commission-icon"
import { DashboardIcon } from "@/app/assets/dashboard-icon"
import { LogoIcon } from "@/app/assets/logo-icon"
import { ProfileIcon } from "@/app/assets/profile-icon"
import { UsersIcon } from "@/app/assets/users-icon"
import { RouteItem, ROUTES } from "@/app/includes/constants"
import Link from "next/link"

export const Navbar = ()=>{
    const RouteList:RouteItem[] = [
        {
            title:"Dashboard",
            icon:<DashboardIcon />,
            route:ROUTES.dashboard,
        },
         {
            title:"Users",
            icon:<UsersIcon />,
            route:ROUTES.users,
        }, {
            title:"Commission",
            icon:<CommissionIcon />,
            route:ROUTES.commission
        }, {
            title:"Profile",
            icon:<ProfileIcon />,
            route:ROUTES.profile
        }
    ]
    return <header className="fixed w-full top-0 left-0 bg-[#f0f0f0] z-10 ">
       <div className="flex items-center  w-full  ">
        <Link className="flex-1 gap-1 flex py-5 text-center items-center justify-center" href={ROUTES.dashboard} >
         <LogoIcon />
         </Link>
        {RouteList.map((item,i)=><Link key={i} className="flex-1 py-4 gap-1 flex  text-center items-center justify-center active:text-[#009668] hover:text-[#009668] focus:text-[#009668] text-[#909090E5]" href={item.route!} >
        {item.icon}
        <span >{item.title}</span>
        </Link>)}
        <div className="flex-1 gap-1 flex text-center items-center justify-center">
        <Link href={ROUTES.notification} className="flex-1 gap-1 flex py-5 text-center items-center justify-center"  >
        <BellIcon />
        </Link>
        </div>
        </div>
    </header>
}