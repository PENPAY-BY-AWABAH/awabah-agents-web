"use client";

import BaseButton from "@/app/components/baseButton";
import BaseModal from "@/app/components/baseModal";
import { TickIcon } from "@/app/assets/tick-icon";
import { MonnifyLogo, PayOnUsLogo } from "@/app/includes/payment-gateways";
import { ReturnComma } from "@/app/includes/functions";
import useHttpHook from "@/app/includes/useHttpHook";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";

export type AgentWithdrawalGateway = "monnify" | "payonus";

interface GatewayOption {
    icon: string | JSX.Element;
    title: string;
    description?: string;
    action: AgentWithdrawalGateway;
    selected: boolean;
}

interface PaymentGatewayModalProps {
    onClose: () => void;
    onContinue: (gateway: AgentWithdrawalGateway) => void;
}

export const PaymentGatewayModal = ({ onClose, onContinue }: PaymentGatewayModalProps) => {
    const { getAllCommisionStats } = useHttpHook();
    const [agree, setAgree] = useState(false);
    const [balance, setBalance] = useState(0);
    const [balanceLoaded, setBalanceLoaded] = useState(false);
    const [options, setOptions] = useState<GatewayOption[]>([
        {
            icon: <MonnifyLogo />,
            title: "Monnify",
            action: "monnify",
            selected: true,
        },
        {
            icon: <PayOnUsLogo />,
            title: "PayOnUs",
            description: "Bank transfer via PayOnUs",
            action: "payonus",
            selected: false,
        },
    ]);

    useEffect(() => {
        getAllCommisionStats().then((res) => {
            if (res.status && res.data?.balance != null) {
                setBalance(Number(res.data.balance) || 0);
            }
            setBalanceLoaded(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- load balance once on open
    }, []);

    const selectedGateway =
        options.find((item) => item.selected)?.action ?? "monnify";

    const selectOption = (index: number) => {
        setOptions((prev) =>
            prev.map((item, i) => ({ ...item, selected: i === index }))
        );
    };

    const hasWithdrawableBalance = balance > 0;
    const formattedBalance =
        balance <= 0
            ? "0.00"
            : ReturnComma(String(balance)) || String(balance);

    return (
        <BaseModal title="Withdraw commission" type="sm" onClose={onClose}>
            <div className="text-left text-[22px] font-bold text-[#07AE20] mb-4">
                ₦{formattedBalance}
            </div>
            {balanceLoaded && !hasWithdrawableBalance ? (
                <div className="mb-4 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[13px] leading-5 text-amber-800">
                    Your commission wallet balance is zero. Earn or receive commission
                    before you can withdraw to a bank account.
                </div>
            ) : null}
            <p className="text-left text-[14px] text-black mb-2">
                Select a payment gateway for this payout
            </p>
            {options.map((option, index) => (
                <button
                    key={option.action}
                    type="button"
                    onClick={() => selectOption(index)}
                    className={`my-3 w-full cursor-pointer rounded-[15px] border text-left ${
                        option.selected
                            ? "border-[#07AE20] bg-green-50 shadow-sm"
                            : "border-[#00000033] bg-white"
                    }`}
                >
                    <div className="flex items-center gap-3 p-3">
                        <div className="flex w-10 shrink-0 items-center justify-center">
                            {typeof option.icon === "string" ? (
                                <img
                                    alt=""
                                    src={option.icon}
                                    className="h-5 w-5 bg-[#ddd]"
                                />
                            ) : (
                                option.icon
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[15px] font-medium text-black">
                                {option.title}
                            </div>
                            {option.description ? (
                                <div className="text-[12px] text-gray-600">
                                    {option.description}
                                </div>
                            ) : null}
                        </div>
                        {option.selected ? (
                            <div className="shrink-0">
                                <TickIcon />
                            </div>
                        ) : null}
                    </div>
                </button>
            ))}
            <label className="my-4 flex cursor-pointer items-start gap-2 text-left text-[13px] text-gray-700">
                <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1"
                />
                <span>
                    By clicking &apos;Next&apos; you agree to our{" "}
                    <Link href={"/terms-and-conditions"} className="text-[#07AE20] underline">
                        Terms and Conditions
                    </Link>
                    .
                </span>
            </label>
            <BaseButton
                disabled={!agree || !hasWithdrawableBalance}
                text="Next"
                type="button"
                onClick={() => onContinue(selectedGateway)}
            />
        </BaseModal>
    );
};
