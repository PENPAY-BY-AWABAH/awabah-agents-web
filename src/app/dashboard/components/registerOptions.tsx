/* eslint-disable react-hooks/exhaustive-deps */
import BaseButton from "@/app/components/baseButton";
import BaseInput from "@/app/components/baseInput";
import { BaseLoader } from "@/app/components/baseLoader";
import BaseModal from "@/app/components/baseModal";
import { CONSTANT, ROUTES } from "@/app/includes/constants";
import { Base64Decode, ReturnAllNumbers } from "@/app/includes/functions";
import useHttpHook from "@/app/includes/useHttpHook";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function RegisterOptions() {
    const [showPIN, setShowPIN] = useState<boolean>(false);
    const [nin, setNIN] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingDetails, setFetchingDetails] = useState<boolean>(false);
    const { ConfirmRegistration, ShowMessage,getUserByEmail } = useHttpHook();
    const [showOptions, setShowOptions] = useState(false);
    const [email, setEmail] = useState<string>("");
    
    const handleConfirmRegistration = () => {
        setLoading(true);
        ConfirmRegistration(String(nin).trim()).then((res) => {
            setLoading(false);
            if (!res.status) {
                ShowMessage({ position: "center", ...res });
                if (res.data?.pinNotFunded) {
                    // base64 decode res.data.userData
                    const userData = Base64Decode(res.data.userData);
                    localStorage.setItem(CONSTANT.LocalStore.remit, userData);
                    window.location.href = ROUTES.remit;
                }
            } else {
                localStorage.setItem(CONSTANT.LocalStore.userFormFields, JSON.stringify(res.data ?? {}));
                ShowMessage({ position: "center", ...res });
                window.location.href = ROUTES.userOnboarding;
            }
        });
    }
    const handleFetchingDetails = (email: string) => {
        setFetchingDetails(true);
        getUserByEmail(email).then((res) => {
            setFetchingDetails(false);
            if (!res.status) {
                ShowMessage({ position: "center", ...res });
                return;
            }else{
                setNIN(Base64Decode(res.data.sNIN));
                setShowPIN(true);
            }
        })
    }
    useEffect(() => {
        const handleEvent = (e: Event) => {
            const detail = (e as CustomEvent<{ email?: string }>).detail ?? {};
            setShowOptions(true);
            if (detail.email) {
                setEmail(detail.email);
                handleFetchingDetails(detail.email);
            }
        }
        window.addEventListener(CONSTANT.Event.showRegisterOptions, handleEvent as EventListener);
        return () => {
            window.removeEventListener(CONSTANT.Event.showRegisterOptions, handleEvent as EventListener);
        }
    }, []);
    if (!showOptions) {
        return null;
    }
    return (<BaseModal
        onClose={() => {
            if (email) {
                setEmail("");
                setShowOptions(false);
                setShowPIN(false);
                return;
            }
            if (showPIN) {
                setShowPIN(false);
                return;
            }
            setShowOptions(false);
        }}
        title={""}
        slideUpOnMobile
    >
        {fetchingDetails ?<div className="flex gap-2 justify-center items-center">
        <BaseLoader 
        modal={false} 
        text={`Fetching details...`} size="md" color="green" />
        <div >{`Wait while we fetch user's details...`}</div>
        </div>:!showPIN ? <div className="grid grid-cols-1 gap-3 p-5">
            <BaseButton
                onClick={() => {
                    setShowPIN(true);
                }}
                type="button"
                text="Continue from where you left off"
            />
            
            <div className="text-[10px] gap-2 text-black/50 mb-[15px] flex items-center">
                <InfoIcon />
                <span >
                Use this option if you have completed some of the registration steps but have not yet made your first contribution.
                </span>
            </div>
            <div className="my-3 bg-gray-300 h-[1px]" />
            <BaseButton
                onClick={() => {
                    window.location.href = ROUTES.userOnboarding;
                }}
                type="button"
                text="Start a new RSA PIN registration."
            />
            
        </div> : <form onSubmit={(e) => {
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
