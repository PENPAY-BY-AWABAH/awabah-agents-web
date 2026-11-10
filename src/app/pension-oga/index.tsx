import { FormEvent, Suspense, useCallback, useEffect, useState } from "react";
import BaseModal from "../components/baseModal";
import { useSearchParams } from "next/navigation";
import BaseInput from "../components/baseInput";
import { OTPBaseInput } from "../components/baseOTPInput";
import { BaseLoader } from "../components/baseLoader";
import BaseButton from "../components/baseButton";
import useHttpHook from "../includes/useHttpHook";
import { ROUTES } from "../includes/constants";

interface FormADataProps {
    otp?: string;
    password?: string;
    confirmPassword?: string;
}

const PensionOgaCreatePassword = () => {
    const params = useSearchParams();
    const accesstoken = params.get("accesstoken");

    // ✅ Initialize from URL params instead of setting them in an effect
    const [showModal, setShowModal] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [counter, setCounter] = useState<number>(30);
    const [resendKey, setResendKey] = useState<number>(0);

    const [formData, setFormData] = useState<FormADataProps>({
        otp: "",
        password: "",
        confirmPassword: "",
    });

    const { handleSendOTPToOga, handleCreateOgaPassword, ShowMessage } = useHttpHook();

    const handleOTP = useCallback(
        (token: string) => {
           
            handleSendOTPToOga(token).then((res) => {
                setLoading(false);
                setProcessing(false);
                if(!res.status)
                {
                  setShowModal(false);  
                }
            });
        },
        [handleSendOTPToOga]
    );

    const handleResend = () => {
        if (!accesstoken) return;
        setCounter(30);
        setResendKey((k) => k + 1);
        setLoading(true);
        setShowModal(true);
        setProcessing(false);
        handleOTP(accesstoken);
    };

    // ✅ setState only runs inside the interval callback (async), never in the effect body
    useEffect(() => {
        const intv = setInterval(() => {
            setCounter((count) => {
                if (count <= 1) {
                    clearInterval(intv);
                    return 0;
                }
                return count - 1;
            });
        }, 1000);
        return () => clearInterval(intv);
    }, [resendKey]);

    // ✅ Defer the side-effect so setState doesn't fire synchronously in the effect body
    useEffect(() => {
        if (!accesstoken) return;
        let cancelled = false;
        queueMicrotask(() => {
            if (cancelled) return;
            setShowModal(true);
            setProcessing(true);
            handleOTP(accesstoken);
        });
        return () => {
            cancelled = true;
        };
    }, [accesstoken]);

    const handleCreatePasword = (e: FormEvent) => {
        e.preventDefault();
        if (!accesstoken) return;

        if (formData.password !== formData.confirmPassword) {
            return ShowMessage({
                status: false,
                message: "Passwords do not match.",
                data: null,
                position: "center",
            });
        }

        setLoading(true);
        handleCreateOgaPassword({
            accesstoken,
            password: formData.password!,
            confirmPassword: formData.confirmPassword!,
            otp: formData.otp!,
        }).then((res) => {
            
            if (res?.status) {
                localStorage.clear();
                setTimeout(()=>{
                setLoading(false);
                window.location.href = ROUTES.login;
                },500)
            }else{
                setLoading(false);
            }
        });
    };
    if(!showModal)
    {
        return null;
    }
    if (processing) {
        return <Suspense 
        fallback={<BaseLoader modal={true} color="green" size="lg" />}
        >
       <BaseLoader modal={true} color="green" size="lg" />
        </Suspense>
    };

    return (
        <BaseModal
            title=""
            onClose={() => {
                if (loading) return;
                setShowModal(false);
            }}
        >
            <form onSubmit={handleCreatePasword}>
                <div className="text-[#000000A6] text-[12px] font-normal text-center mb-1 mt-1 w-[80%] m-auto">
                    Please enter the code sent to your email to continue.
                </div>

                <div className="text m-auto">
                    <div className="text m-auto my-[30px] w-[220px]">
                        <OTPBaseInput
                            onChange={(otp) => {
                                setFormData((prev) => ({ ...prev, otp }));
                            }}
                            isInputNum
                            count={4}
                            value={formData.otp!}
                            required
                        />
                    </div>

                    <div className="text-[#B8860B] text-[14px] font-normal text-center mb-0 mt-0 w-[80%] m-auto">
                        0:{String(counter).padStart(2, "0")}
                    </div>

                    <div className="flex items-center justify-center mt-[10px] gap-1">
                        <span className="text-[14px] text-black">Didn&apos;t get a code?</span>
                        <button
                            type="button"
                            disabled={counter !== 0}
                            onClick={handleResend}
                            className="text-[14px] text-[#009668] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Resend
                        </button>
                    </div>

                    <BaseInput
                        type="password"
                        name="password"
                        value={formData?.password}
                        required
                        onValueChange={({ value }) => {
                            setFormData((prev) => ({
                                ...prev,
                                password: String(value).trim(),
                            }));
                        }}
                        label="Password"
                        placeholder="Enter Your Password."
                    />

                    <BaseInput
                        type="password"
                        name="confirmPassword"
                        value={formData?.confirmPassword}
                        required
                        onValueChange={({ value }) => {
                            setFormData((prev) => ({
                                ...prev,
                                confirmPassword: String(value).trim(),
                            }));
                        }}
                        label="Confirm Password"
                        placeholder="Enter your confirm password."
                    />

                    <BaseButton
                        disabled={formData.otp?.length !== 4}
                        text="Create New Password"
                        type="submit"
                    />
                </div>

                {loading && <BaseLoader color="green" size="lg" modal text="Sending..." />}
            </form>
        </BaseModal>
    );
};

export default PensionOgaCreatePassword;