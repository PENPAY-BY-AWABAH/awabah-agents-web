import { ReactNode } from "react";

interface BaseModalProps {
    onClose?:()=>void;
    children:ReactNode;
    title:string;
    type?:"md"|"lg"|"sm"
}
const BaseModal = (props:BaseModalProps)=>{
    return <div className="fixed inset-0 p-[16px] flex items-center justify-center bg-[rgba(0,0,0,0.5)] bg-opacity-50" style={{zIndex:10}}>
    <div className={`bg-white p-4 rounded-lg shadow-lg ${props.type === "lg"?"max-w-[95vw]":props.type === "md"?"max-w-[50vw]":"max-w-lg"} w-full`}>
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