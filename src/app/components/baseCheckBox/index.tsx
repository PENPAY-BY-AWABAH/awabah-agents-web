/* eslint-disable react-hooks/set-state-in-effect */
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface BaseToggleBtnProps {
type:"checkbox"|"radio"|"custom";
onChange:(value:boolean)=>void;
value:boolean;
disabled?:boolean;
required?:boolean;
}
const BaseToggleBtn = (props:BaseToggleBtnProps)=>{
    const [checked,setChecked] = useState<boolean>(false)
    useEffect(()=>{
      if(props.type !== "custom")
      {
        setChecked(props.value)
      }
    },[props])
   
    if(props.type === "custom")
    {
        return <button
        type="button"
        disabled={props.disabled}
        onClick={()=>{
            setChecked(!checked)
            props.onChange(!checked)
        }}
        className={`border-[1px] h-[20px] hover:border-[5px] cursor-pointer rounded-[20px] bg-white w-[20px] border-[#707070] hover:border-[#216b33] flex items-center justify-center`} 
        style={{borderColor:"#707070",borderWidth:1,background:checked?"#216b33":"white"}}
        >
          {checked && <CheckIcon size={15} color="white" />}
        </button>
    }
    return <input 
    type={props.type}
    required={props.required}
    disabled={props.disabled}
    checked={checked}
    onChange={()=>{
        setChecked(!checked)
        props.onChange(!checked)
    }}
    />
}
export default BaseToggleBtn;