/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { toast } from "react-toastify";
import { CONSTANT } from "./constants";
import {name} from "../../../package.json"
interface ApiResponse {
    status:boolean;
    message:string;
    data:any;
    statusCode?:number;
}
interface PayloadProps {
   requestType:"form-data"|"json"
   method:"POST"|"GET";
   body:UnknownKeyPair,
   path:"admin-sign-in"|"transactions"|"admin-sign-otp"|"admin-all-transactions" | string;
}
export interface UnknownKeyPair {
    [key: string]: any; 
  }
export const useApiRequest = ()=>{
    const [loading,setLoading] = useState<boolean>(false);
    const call = async(props:PayloadProps,showMessage?:boolean)=>{
    return new Promise<ApiResponse>(async (resolve)=>{
        const body = new FormData();
        const accessToken = await localStorage.getItem(name)
        setLoading(true)
        Object.keys(props.body).forEach((a:string)=>{
          console.log("keys:",a);
            body.append(a,props.body[a])
        })
        const options:any = {
            method:props.method,
            headers:{
              "Content-type":props.requestType == "form-data"?"multipart/form-data":"application/json",
              "Authorization":`Bearer ${accessToken}`
            }
            }
        if(props.method !== "GET")
        {
          if(props.requestType == "form-data")
          {
            options.headers = {
              "Authorization":`Bearer ${accessToken}`
            }
          }
          options["body"] = props.requestType == "form-data"? body:JSON.stringify(props.body);
        }
        console.log(options)
        fetch(`${CONSTANT.BaseURL}${props.path}`,options).then((response)=>response.json()).then((response)=>{
            setLoading(false)
            console.log(response);
            if(response.status)
            {
            if(response.data?.accessToken)
            {
            localStorage.setItem(CONSTANT.LocalStore.token,response.data.accessToken)
            }
            if(showMessage)
            {
            toast.success(response.message)
            }
            }
            if(String(response.message).toLowerCase().includes("invalid access"))
            {
              // localStorage.clear();
              // navigate.replace(ROUTES.login)
            }
            resolve(response)
        }).catch((error)=>{
            setLoading(false)
            toast.error(error.message)  
            resolve({
                status:false,
                message:error.message,
                data:{}
            })
        })
    })
    }
    return {
    call,
    loading
    }
}

export const ValidateEmail = (value:string)=>{
    const valid = value.match(
        /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    return valid;
}
export function RemoveSpecialCharaters(d: string) {
  d = String(d).trim();
  return d.replace(/[-+,&\/\\#()$~%.;'":*?<>{}@ ]/g, '');
}
export function ReturnAllNumbers(d: string) {
  d = String(d).trim();
  return d.replace(/[-+,&\/\\#()$~%.;'":*?<>{}A-Z a-z]/g, '');
}
export function ReturnUsername(d: string) {
  d = String(d).trim();
  return d.replace(/[-+,&\/\\#()$~%.;'":*?<>{} 0-9]/g, '');
}
export function ReturnAccountUsername(d: string) {
  d = String(d).trim();
  return d.replace(/[-+,&\/\\#()$~%.;'":*?<>{} ]/g, '');
}
export function ReturnAllNumbersWithComma(d: string) {
  d = String(d).trim();
  return d.replace(/[-+&\/\\#()$~%.;'":*?<>{}A-Z a-z]/g, '');
}
export function ReturnMobile(d: string) {
  d = String(d).trim();
  d = String(d[0]) === '0' ? d.replace('0', '') : d;
  return d.replace(/[-+,&\/\\#()$~%.;'":*?<>{}A-Z a-z]/g, '');
}
export function ReturnAllLetter(d: string) {
  d = String(d).trim();
  return d.replace(/[-+,&\/\\#()$~%.;'":*?<>{} 0-9]/g, '');
}
export function ReturnComma(str: string) {
  if(String(str) === "0.00")
  {
    return str;
  }
  if (str === '' || str === ' ' || `${str[0]}` === "0") {
    return "";
  }
  if (str === '.') {
    return String(str).replace('.', '0');
  }
  
  str = String(str).replace(/[^0-9.]/g, '');
  const getDot = String(str).split('.');
  let firstPart = getDot[0];
  if (firstPart.length >= 4) {
    firstPart = firstPart.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (getDot.length >= 2) {
    return firstPart + '.' + getDot[1];
  }
  if (String(firstPart) === '.00') {
    return '';
  }
  return firstPart;
}
  
export const ExportCSVFile = (list:any[],fileName:string = "excelfile")=>{
  const convertToCSV = (array:any[]) => {
    const header = Object.keys(array[0]).join(',') + '\n';
    const rows = array.map(obj => Object.values(obj).join(',')).join('\n');
    return header + rows;
  };

    const csv = convertToCSV(list);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName+'.csv';
    a.click();
    URL.revokeObjectURL(url); // Clean up
}
export const ExportJSONFile = (list:any[],fileName:string = "excelfile")=>{
    const blob = new Blob([JSON.stringify(list)], { type: 'text/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName+'.json';
    a.click();
    URL.revokeObjectURL(url); // Clean up
}


 export const PFABankAccounts = ()=>{
  return [
    {
      name:"FIDELITY",accountNumber:"2008709035",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"OAK",accountNumber:"2007909319",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"NLPC",accountNumber:"2006895606",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"PREMIUM",accountNumber:"2006857970",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"VERITAS",accountNumber:"2008709028",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"GLANVILLS",accountNumber:"2008709028",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"ACCESS",accountNumber:"2042399582",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"ARM",accountNumber:"2042399582",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"CRUSADER",accountNumber:"2006915627",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"TANGERINE",accountNumber:"2008709004",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"NUPEMCO",accountNumber:"2033895974",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"NIGERIAN",accountNumber:"2033895974",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"NORRENBERGER",accountNumber:"2042561615",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"NPF",accountNumber:"2024545437",bankName:"FIRSTBANK",bankCode:"011"
    },
    {
      name:"FCMB",accountNumber:"1005385514",bankName:"UBA",bankCode:"033"
    },
    {
      name:"LEADWAY",accountNumber:"1005906472",bankName:"UBA",bankCode:"033"
    },
    {
      name:"ALLIANCE",accountNumber:"1005385521",bankName:"UBA",bankCode:"033"
    },
    {
      name:"PAL ",accountNumber:"1005385521",bankName:"UBA",bankCode:"033"
    },
    {
      name:"CARDINALSTONE",accountNumber:"1010527796",bankName:"UBA",bankCode:"033"
    },
    {
      name:"CITIZENS",accountNumber:"1028014992",bankName:"UBA",bankCode:"033"
    },
    {
      name:"TRUSTFUND",accountNumber:"1010925059",bankName:"Zenith",bankCode:"057"
    },
    {
      name:"GT",accountNumber:"1224125427",bankName:"Zenith",bankCode:"057"
    },
    {
      name:"GTCO",accountNumber:"1224125427",bankName:"Zenith",bankCode:"057"
    },
    {
      name:"GUARANTY",accountNumber:"1224125427",bankName:"Zenith",bankCode:"057"
    },
    {
      name:"STANBIC",accountNumber:"1010885522",bankName:"Zenith",bankCode:"057"
    },
    {
      name:"IBTC",accountNumber:"1010885522",bankName:"Zenith",bankCode:"057"
    },
    {
      name:"PARTHIAN",accountNumber:"2047088759",bankName:"Zenith",bankCode:"057"
    }
  ]
 }
 export const SendWindowMessage = (name:string,data:any)=>{
 const CustomMessage = new CustomEvent(name, {
  detail:data
})
window.dispatchEvent(CustomMessage);
 }

 export const CopyToClipboard = (text:string)=>{
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copied to clipboard")
  }).catch((err) => {
    toast.error("Failed to copy text: " + err);
  });
}
