import BaseButton from "@/app/components/baseButton";
import BaseInput from "@/app/components/baseInput";
import BaseModal from "@/app/components/baseModal";
import { CONSTANT, ROUTES } from "@/app/includes/constants";
import { Base64Decode, ReturnAllNumbers } from "@/app/includes/functions";
import useHttpHook from "@/app/includes/useHttpHook";
import { useEffect, useState } from "react";

export default function RegisterOptions() {
    const [showPIN, setShowPIN] = useState<boolean>(false);
    const [nin, setNIN] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { ConfirmRegistration,ShowMessage } = useHttpHook();
    const [showOptions, setShowOptions] = useState(false);

    const handleConfirmRegistration = ()=>{
        setLoading(true);
        ConfirmRegistration(String(nin).trim()).then((res) => {
            setLoading(false);
            if(!res.status)
            {
            ShowMessage({position:"center",...res});
            if(res.data?.pinNotFunded)
            {
            // base64 decode res.data.userData
            const userData = Base64Decode(res.data.userData);
            localStorage.setItem(CONSTANT.LocalStore.remit, userData);
            window.location.href = ROUTES.remit;
            }
            }else{
            localStorage.setItem(CONSTANT.LocalStore.userFormFields, JSON.stringify(res.data ?? {}));
            ShowMessage({position:"center",...res});
            window.location.href = ROUTES.userOnboarding;
            }
        });
    }
    useEffect(() => {
        const handleEvent = ()=>{
            setShowOptions(true);
        }
       window.addEventListener(CONSTANT.Event.showRegisterOptions,  handleEvent);
       return () => {
        window.removeEventListener(CONSTANT.Event.showRegisterOptions,  handleEvent);
       }
    }, []);
    if(!showOptions)
    {
        return null;
    }
    return (<BaseModal 
    onClose={() => {
        if(showPIN)
        {
        setShowPIN(false);
        return;
        }
       setShowOptions(false);
    }}
    title={""}
    slideUpOnMobile
    >
            {!showPIN?<div className="grid grid-cols-1 gap-3">
            <BaseButton
                onClick={() => {
                   setShowPIN(true);
                }}
                type="button"
                text="Continue from where you left off"
            />
            <BaseButton
                onClick={() => {
                    window.location.href = ROUTES.userOnboarding;
                }}
                type="button"
                text="New RSA PIN registration"
            />
            </div>:<form onSubmit={(e) => {
                e.preventDefault();
                handleConfirmRegistration();
            }}>
            <div className="grid grid-cols-1 gap-3">
                <div
                className="p-3 font-light rounded-md text-black/50 text-center"
                >
                 Enter your NIN to continue if you have registered before and have not received your RSA PIN.
                </div>
                <BaseInput
                    placeholder="Enter your NIN"
                    name="nin"
                    value={ReturnAllNumbers(nin)}
                    max={11}
                    required
                    type="password"
                    onValueChange={(value) => {
                        setNIN(value.value);
                    }}
                />
                <BaseButton
                loading={loading}
                type="submit"
                text="Continue"
                />
                </div>
            </form>}
        </BaseModal>
    )
}
