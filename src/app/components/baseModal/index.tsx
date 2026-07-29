import { ReactNode } from "react";

interface BaseModalProps {
    onClose?:()=>void;
    children:ReactNode;
    title:string;
    type?:"md"|"lg"|"sm"
    slideUp?:boolean;
    slideUpOnMobile?:boolean;
}
const BaseModal = (props:BaseModalProps)=>{
    const sizeClass = props.type === "lg"
        ? "w-full max-w-[95vw]"
        : props.type === "md"
            ? "w-full max-w-[95vw] md:max-w-[50vw]"
            : "w-full max-w-full md:max-w-lg";
    const bottomSheetClass = props.slideUp
        ? "absolute bottom-[0px] left-[0] right-[0] rounded-b-none rounded-t-[24px] slide-up-modal"
        : props.slideUpOnMobile
            ? "absolute bottom-[0px] left-[0] right-[0] rounded-b-none rounded-t-[24px] slide-up-mobile md:relative md:bottom-auto md:left-auto md:right-auto md:rounded-lg"
            : "";

    return <div className={`fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50 ${props?.slideUp?"p-0 items-end":props?.slideUpOnMobile?"p-0 items-end md:p-4 md:items-center":"p-4"} `} style={{zIndex:10}}>
    <style>{`
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .slide-up-modal {
            animation: slideUp 0.3s ease-out forwards;
        }
        @media (max-width: 767px) {
            .slide-up-mobile {
                animation: slideUp 0.3s ease-out forwards;
            }
        }
    `}</style>
    <div className={`bg-white p-4 rounded-lg shadow-lg ${sizeClass} ${bottomSheetClass}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">{props.title}</h3>
        <button 
        onClick={props.onClose}
        className="text-gray-600 hover:text-gray-900 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mb-4 p-3">
       {props.children}
      </div>
    </div>
  </div>
}
export default BaseModal;
