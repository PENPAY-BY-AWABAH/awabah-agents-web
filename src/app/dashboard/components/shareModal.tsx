"use client";

import BaseModal from "@/app/components/baseModal";
import { CopyToClipboard } from "@/app/includes/functions";
import useCommissionStore from "@/app/includes/store";
import { Copy, Link2, Share2 } from "lucide-react";
import { useState } from "react";

export const ShareModal = ({
    onClose,
}: {
    onClose: () => void;
}) => {
    const { userDetails } = useCommissionStore()
    const agentId = userDetails?.agentId
    const accountType = userDetails?.accountType
    const [shareTo, setShareTo] = useState("anyone");
    const shareUrl = !window.location.href.includes("localhost")?`https://${window.location.href.includes("demo") ? "demo." : ""}${shareTo === "anyone"?"onboarding":"agent"}.awabah.com/?referrer=${agentId ?? ""}`:`http://localhost:3000/?referrer=${agentId ?? ""}`;
    const shareText = `Register for Personal Pension today. Sign up using my referral link below\n${shareUrl}`;
    const handleNativeShare = async () => {
        if (!navigator.share) {
            CopyToClipboard(shareUrl);
            return;
        }

        try {
            await navigator.share({
                title: "Awabah Agent Referral Code",
                text: shareText,
                url: shareUrl,
            });
        } catch {
            return;
        }
    };
    const [showOptions, setShowOptions] = useState(true);
    return <BaseModal
        title="Share your referral"
        onClose={()=>{
            if(!showOptions)
            {
                return setShowOptions(true);
            }
            onClose();
        }}
        type="sm"
    >{showOptions ?<div>
        <div >
         Who do you want to share with?
        </div>
        <div className="grid gap-4">
        <button
                type="button"
                onClick={()=>{
                    setShareTo("anyone");
                    setShowOptions(false);
                }}
                className="flex text-left  cursor-pointer items-center rounded-[8px] border border-[#d4d4d8] bg-white p-3 shadow-sm"
           >
       Share my code with <span className="px-2 m-0 font-bold">users</span>.
        </button>
        {accountType === "SuperAgent" && <button
                type="button"
                 onClick={()=>{
                    setShareTo("agent");
                    setShowOptions(false);
                }}
                className="flex text-left  cursor-pointer items-center rounded-[8px] border border-[#d4d4d8] bg-white p-3 shadow-sm"
           >
         Share my code with <span className="px-2 m-0 font-bold">agent</span>.
        </button>}
        </div>
    </div>:
        <div className="grid gap-4">
            <div className="text-[14px] leading-7 text-[#64748b]">
            {shareTo !== "anyone" ?"Share this link to invite new agents to join your network.":"Share this link with anyone to register their RSA PIN."}
            </div>
            <button
                type="button"
                onClick={() => CopyToClipboard(agentId || "")}
                className="flex text-left  cursor-pointer items-center gap-4 rounded-[8px] border border-[#d4d4d8] bg-white p-3 shadow-sm"
            >
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#e6f4ee] text-[#009668]">
                    <Copy size={18} />
                </div>
                <div className="flex-grow">
                    <div className="text-[14px] font-bold text-[#18181b]">Copy code</div>
                    <div className="truncate text-[14px] text-[#71717a]">{agentId || "No referral code yet"}</div>
                </div>
            </button>

            <button
                type="button"
                onClick={() => CopyToClipboard(shareUrl)}
                className="flex text-left  cursor-pointer items-center gap-4 rounded-[8px] border border-[#d4d4d8] bg-white p-3 shadow-sm"
           >
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#e6f4ee] text-[#009668]">   
                     <Link2 size={26} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-[#18181b]">Copy link</div>
                    <div className="text-wrap text-[14px] text-[#71717a]">{shareUrl}</div>
                </div>
            </button>
            <button
                type="button"
                onClick={handleNativeShare}
                className="flex text-left  cursor-pointer items-center gap-4 rounded-[8px] border border-[#d4d4d8] bg-white p-3 shadow-sm"
           >
                   <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#e6f4ee] text-[#009668]">
                   <Share2 size={26} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-[#18181b]">Share to apps</div>
                    <div className="truncate text-[14px] text-[#71717a]">Open your device share sheet</div>
                </div>
            </button>
              <div className="rounded-[14px] bg-[#f4f4f5] p-3 text-[14px] text-[#3f3f46]">
                <span className="font-bold">Message:</span>{" "}
                {shareTo !== "anyone" ?"Join Awabah as an Agent and start earning. Sign up using my referral link and referral code.":"Register for Personal Pension today. Sign up using referral link and code."}
            </div>
        </div>}
    </BaseModal>
}
