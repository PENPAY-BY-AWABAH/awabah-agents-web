import { BaseLoader } from "@/app/components/baseLoader"

export const LinkBankModal = ({onClose,text}:{onClose: () => void,text:string}) => {    
    return <div className="fixed flex inset-0 items-center justify-center z-50 m-auto bg-[rgba(0,0,0,0.5)] bg-opacity-50 h-full w-full ">
    <div className="m-auto items-center justify-center">
    <div className="m-auto flex items-center justify-center">
    <BaseLoader size="lg" color="green" />
    </div>
    <div className="text-center mt-4 font-medium text-white">{text}</div>
    </div>
    </div>
}