/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import './style.css';
import OTPInput from 'react18-input-otp';
interface OTPBaseInputProps {
    count?: number;
    onChange:(otp:string)=>void;
    isInputNum?:boolean;
    value:string;
}
export const OTPBaseInput = (props: OTPBaseInputProps) => {
    const [otp, setOtp] = useState<string>("")
    useEffect(() => {
        props.onChange(otp);
    }, [otp])
    
    useEffect(() => {
        setOtp(props.value!)
    }, [props.value])

    return <div >
        <OTPInput
            value={otp}
            onChange={(enteredOtp: string) => {
                setOtp(enteredOtp);
            }}
            numInputs={props?.count?props.count:4}
            inputStyle={{
                display: "block",
                width: "100%",
                paddingVertical: 5,
                paddingHorizontal: 0.75,
                fontSize: 16,
                fontWeight: "bold",
                height: 40,
                color: "#212529",
                backgroundColor: "#fff",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#ced4da",
                borderRadius: 8,
                transition: "border-color .15s ease-in-out",
                boxShadow: ".15s ease-in-out"
            }}
            isInputNum={props?.isInputNum}
            separator={<span style={{ width: 10 }}></span>}
        />
    </div>
}