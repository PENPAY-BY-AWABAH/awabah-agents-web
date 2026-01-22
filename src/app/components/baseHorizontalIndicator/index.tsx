import { useEffect, useState } from "react"

export const BaseHorizontalIndicator = ({count = 3,selectedIndex=0,onClick}:{count?:number;selectedIndex:number;onClick?:(index:number)=>void;})=>{
    const [itemIndex,setItemIndex] = useState<number>(0);
    const [list,setList] = useState(Array.from({length:count}).map((item,i)=>{
        return {
            selected:i === itemIndex
        }
    }))
useEffect(()=>{
    setItemIndex(selectedIndex);
},[selectedIndex])
return <div 
className={`flex items-center justify-center gap-3`}
>
{list.map((item,index)=><div
onClick={()=>{
    if(onClick)
    {
    onClick(index)
    setItemIndex(index);
    }
}}
key={index} className={`${index <= itemIndex?"bg-[#009668]":"bg-[#C4C4C4CC]"} h-[5px] rounded-[10px] flex-1 cursor-pointer`} ></div>)}
</div>
}