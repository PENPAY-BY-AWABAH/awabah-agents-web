"use client"
interface BaseButtonProps {
    text:string;
    onClick?:()=>void;
    type:"submit"|"button";
    loading?:boolean;
    disabled?:boolean;
    white?:boolean;
}
function BaseButton(props:BaseButtonProps) {
    return <button 
    disabled={props.loading || props.disabled}
    type={props.type}
    onClick={props.onClick}
    className={props.white?`w-full flex items-center justify-center gap-2 h-[50px] px-4 border-[1px]  rounded-[15px] shadow-sm text-[#009668] bg-white hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#009668] focus:ring-offset-2 ${props.loading || props.disabled?"border-[#ddd] text-[#ddd] cursor-not-allowed":"border-[#009668] text-[#009668] cursor-pointer"}`:`w-full cursor-pointer flex items-center justify-center gap-2 h-[50px] px-4 border border-transparent rounded-[15px] text-white ${props.loading || props.disabled?"bg-[#80808062] ":"bg-[#009668] hover:bg-[#009668]"}  focus:outline-none focus:ring-2 focus:ring-[#009668]focus:ring-offset-2`}>
    {props.loading && <BaseSpinner />}
    {props.text}
    </button>
}

export default BaseButton;

export const BaseSpinner = ({color}:{color?:"border-white"|"border-green-600"})=>{
    return <div className={`w-6 h-6 border-2 border-t-transparent ${color?color:"border-white"} border-solid rounded-full animate-spin`}></div>
}