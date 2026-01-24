import BaseModal from "@/app/components/baseModal"
import { useState } from "react"
import { UserDetails } from "../../page"
import { BaseLoader } from "@/app/components/baseLoader"
import { ROUTES } from "@/app/includes/constants"
import { useRouter } from "next/navigation"

export const LogoutModal = ({onClose,details}:{onClose:()=>void;details:UserDetails})=>{
    const [loading,setLoading] = useState<boolean>(false);
    const navigate = useRouter()
    const handleLogout = ()=>{
        setLoading(true);
        localStorage.clear();
        setTimeout(()=>{
          setLoading(false); 
          onClose()
          navigate.replace(ROUTES.login) 
        },1000)
    }
    
    return <BaseModal 
        title=""
        onClose={onClose}
        >
        <div>
         <div className="bg-slate-50 p-6 text-center border-b border-gray-100">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
                <h5 className="text-xl font-bold text-gray-800" id="logoutModalLabel">Confirm Logout</h5>
            </div>

            <div className="modal-body p-8 text-center text-gray-500">
                Are you sure you want to end your session? You will need to login again to access your transactions.
            </div>

            <div className="p-6 flex gap-3 justify-center bg-gray-50">
                <button 
                onClick={onClose}
                type="button" className="flex-1 flex item-center justify-center cursor-pointer py-3 px-4 rounded-[15px] font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors" >
                    <span>No, Stay</span>
                </button>
                <button 
                onClick={handleLogout} 
                 className="flex-1 flex cursor-pointer item-center gap-1 justify-center py-3 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 text-center no-underline transition-colors shadow-md shadow-red-200">
                   {loading &&<BaseLoader color="white" size="md" />}
                    <span>Yes, Logout</span>
                </button>
            </div>
        </div>
        </BaseModal>
}